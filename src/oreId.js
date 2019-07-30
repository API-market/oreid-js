import axios from 'axios';
import { initAccessContext } from 'eos-transit';

import Helpers from './helpers';
import LocalState from './localState';
import {
  transitProviderAttributes,
  ualProviderAttributes,
  supportedTransitProviders,
  supportedUALProviders,
  providersNotImplemented
} from './constants';

const PROVIDER_TYPE = {
  custodial: 'custodial',
  ual: 'ual',
  transit: 'transit'
};

// avoid Helpers.isNullOrEmpty, use isNullOrEmpty()
const { isNullOrEmpty } = Helpers;

export default class OreId {
  constructor(options) {
    this.options = null;
    this.appAccessToken = null;
    this.localState = new LocalState(options);
    this.chainContexts = {};
    this.cachedChainNetworks = null;

    this.validateOptions(options);
    this.validateProviders();
  }

  async validateProviders() {
    const { ualProviders, eosTransitWalletProviders } = this.options;
    if (!isNullOrEmpty(eosTransitWalletProviders) && !isNullOrEmpty(ualProviders)) {
      const duplicates = eosTransitWalletProviders
        .map((makeWalletProvider) => makeWalletProvider({}))
        .map((provider) => provider.id)
        .filter((transitProvider) => {
          return ualProviders.find((ualProvider) => {
            return transitProvider.toLowerCase().includes(ualProvider.name.toLowerCase());
          });
        });

      // TODO: Return name of both duplicate providers (current only returns transit duplicates)
      if (!isNullOrEmpty(duplicates)) {
        throw Error(`Duplicate providers's found -> ${duplicates}. Please remove one before continuing.`);
      }
    }
  }

  // todo: handle multiple networks
  async chainNetworks() {
    if (!this.cachedChainNetworks) {
      // load the chainNetworks list from the ORE ID API
      const results = await this.getConfigFromApi('chains');
      this.cachedChainNetworks = results.chains;
    }

    return this.cachedChainNetworks;
  }

  async getNetworkConfig(chainNetwork) {
    const networks = await this.chainNetworks();

    const chainConfig = networks.find((n) => n.network === chainNetwork);
    if (!chainConfig) {
      throw new Error(`Invalid chain network: ${chainNetwork}.`);
    }

    const { hosts } = chainConfig;
    const { chainId, host, port, protocol } = hosts[0]; // using first host
    return { host, port, protocol, chainId };
  }

  async getOrCreateChainContext(chainNetwork) {
    const { appName, eosTransitWalletProviders = [] } = this.options;
    if (this.chainContexts[chainNetwork]) {
      return this.chainContexts[chainNetwork];
    }

    const NETWORK_CONFIG = await this.getNetworkConfig(chainNetwork);

    // create context
    const chainContext = initAccessContext({
      appName: appName || 'missing appName',
      network: NETWORK_CONFIG,
      walletProviders: eosTransitWalletProviders
    });
    // cache for future use
    this.chainContexts[chainNetwork] = chainContext;
    return chainContext;
  }

  // Two paths
  // send code - params: loginType and email|phone)
  // verify code - params: loginType, email|phone, and code to check
  async callPasswordlessApi(options, verify = false) {
    const { provider, phone, email, code } = options;
    const { apiKey, oreIdUrl } = this.options;

    if (!provider || !(phone || email) || (verify && !code)) {
      throw new Error('Missing a required parameter');
    }

    let action = 'send';
    if (verify) {
      action = 'verify';
    }

    let url = `${oreIdUrl}/api/account/login-passwordless-${action}-code?provider=${provider}`;

    if (email) {
      url += `&email=${email}`;
    }
    if (phone) {
      // if user passes in +12103334444, the plus sign needs to be URL encoded
      const encodedPhone = encodeURIComponent(phone);

      url += `&phone=${encodedPhone}`;
    }

    if (verify) {
      url += `&code=${code}`;
    }

    let response = {};
    try {
      response = await axios.get(url, {
        headers: { 'api-key': apiKey }
      });
    } catch (error) {
      response = error.response;
    }

    return response.data;
  }

  // email - localhost:8080/api/account/login-passwordless-send-code?provider=email&email=me@aikon.com
  // phone - localhost:8080/api/account/login-passwordless-send-code?provider=phone&phone=+12125551212
  async passwordlessSendCodeApi(options) {
    let result = {};

    try {
      result = await this.callPasswordlessApi(options);
    } catch (error) {
      return { error };
    }

    return result;
  }

  // email - localhost:8080/api/account/login-passwordless-verify-code?provider=email&email=me@aikon.com&code=473830
  // phone - localhost:8080/api/account/login-passwordless-verify-code?provider=phone&phone=12125551212&code=473830
  async passwordlessVerifyCodeApi(options) {
    let result = {};

    try {
      result = await this.callPasswordlessApi(options, true);
    } catch (error) {
      return { error };
    }

    return result;
  }

  async login(loginOptions) {
    const { provider } = loginOptions;

    if (providersNotImplemented.includes(provider)) {
      throw new Error('Not Implemented');
    }

    if (supportedTransitProviders.includes(provider) || supportedUALProviders.includes(provider)) {
      return this.loginWithNonOreIdProvider(loginOptions);
    }

    return this.loginWithOreId(loginOptions);
  }

  // sign transaction with keys in wallet - connect to wallet first
  async sign(signOptions) {
    // handle sign transaction based on provider type
    const { provider } = signOptions;

    if (providersNotImplemented.includes(provider)) {
      return;
    }

    if (this.isCustodial(provider)) {
      return this.custodialSignWithOreId(signOptions);
    }

    if (supportedTransitProviders.includes(provider) || supportedUALProviders.includes(provider)) {
      return this.signWithNonOreIdProvider(signOptions);
    }

    return this.signWithOreId(signOptions);
  }

  // connect to wallet and discover keys
  // any new keys discovered in wallet are added to user's ORE ID record
  async discover(discoverOptions) {
    const { provider, chainNetwork = 'eos_main', oreAccount, discoveryPathIndexList } = discoverOptions;
    this.assertValidProvider(provider);

    let result = null;

    if (this.canDiscover(provider)) {
      result = this.discoverCredentialsInWallet(chainNetwork, provider, oreAccount, discoveryPathIndexList);
    } else {
      const transitWallet = await this.setupTransitWallet({ provider, chainNetwork });

      // for scatter, you have to logout and log back in to get the option to choose a new account
      await transitWallet.logout();
      transitWallet.login();
    }

    return result;
  }

  // throw error if invalid provider
  assertValidProvider(provider) {
    if (transitProviderAttributes[provider]) {
      return true;
    }
    throw new Error(`Provider ${provider} is not a valid option`);
  }

  // determine whether discovery is supported by the provider
  canDiscover(provider) {
    if (this.isUALProvider(provider)) {
      return false;
    }

    return transitProviderAttributes[provider].supportsDiscovery === true;
  }

  async loginWithOreId(loginOptions) {
    const { code, email, phone, provider, state } = loginOptions;
    const { authCallbackUrl, backgroundColor } = this.options;
    const args = {
      code,
      email,
      phone,
      provider,
      backgroundColor,
      callbackUrl: authCallbackUrl,
      state
    };
    const loginUrl = await this.getOreIdAuthUrl(args);
    return { loginUrl, errors: null };
  }

  async signWithOreId(signOptions) {
    const { signCallbackUrl } = this.options;
    signOptions.callbackUrl = signCallbackUrl;
    const signUrl = await this.getOreIdSignUrl(signOptions);
    return { signUrl, errors: null };
  }

  async custodialSignWithOreId(signOptions) {
    const { apiKey, oreIdUrl, serviceKey } = this.options;
    if (!serviceKey) {
      throw new Error('Missing serviceKey in oreId config options - required to call api/custodial/new-user.');
    }

    const { account, allowChainAccountSelection, broadcast, chainAccount, chainNetwork, returnSignedTransaction, transaction, userPassword } = signOptions;
    const encodedTransaction = Helpers.base64Encode(transaction);
    const body = {
      account,
      allow_chain_account_selection: allowChainAccountSelection,
      broadcast,
      chain_account: chainAccount,
      chain_network: chainNetwork,
      return_signed_transaction: returnSignedTransaction,
      transaction: encodedTransaction,
      user_password: userPassword
    };

    const url = `${oreIdUrl}/api/custodial/sign`;
    const response = await axios.post(url,
      JSON.stringify(body),
      { headers: { 'Content-Type': 'application/json', 'api-key': apiKey, 'service-key': serviceKey },
        body
      });
    const { error } = response;
    if (error) {
      throw new Error(error);
    }
    const { data } = response;
    const { signed_transaction: signedTransaction, transaction_id: transactionId } = data;
    return { signedTransaction, transactionId };
  }

  // OreId does not support signString
  async signString(signOptions) {
    const { provider } = signOptions;
    if (!this.canSignString(provider)) {
      throw Error(`The specific provider ${provider} does not support signString`);
    }

    return this.isUALProvider(provider)
      ? this.signArbitraryWithUALProvider(signOptions)
      : this.signArbitraryWithTransitProvider(signOptions);
  }

  canSignString(provider) {
    if (supportedTransitProviders.includes(provider) || supportedUALProviders.includes(provider)) {
      const isUALProvider = this.isUALProvider(provider);
      if (isUALProvider) {
        return ualProviderAttributes[provider].supportsSignArbitrary;
      }

      return transitProviderAttributes[provider].supportsSignArbitrary;
    }

    return false;
  }

  async signArbitraryWithUALProvider({ provider, chainNetwork, string, chainAccount, message }) {
    const { user } = await this.connectToUALProvider({ provider, chainNetwork, accountName: chainAccount });
    try {
      this.setIsBusy(true);
      const keys = await user.getKeys();
      const response = await user.signArbitrary(keys[0], string, message);
      return { signedString: response };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      this.setIsBusy(false);
    }
  }

  async signArbitraryWithTransitProvider({ provider, chainNetwork, string, message }) {
    const { transitWallet } = await this.connectToTransitProvider({ provider, chainNetwork });
    try {
      this.setIsBusy(true);
      const response = await transitWallet.signArbitrary(string, message);
      return { signedString: response };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      this.setIsBusy(false);
    }
  }

  async signWithNonOreIdProvider(signOptions) {
    const isUALProvider = this.isUALProvider(signOptions.provider);
    return isUALProvider ? this.signWithUALProvider(signOptions) : this.signWithTransitProvider(signOptions);
  }

  async signWithUALProvider({ provider, broadcast, chainNetwork, transaction, chainAccount }) {
    const { user } = await this.connectToUALProvider({ provider, chainNetwork, accountName: chainAccount });
    try {
      this.setIsBusy(true);
      const response = await user.signTransaction({ actions: [transaction] }, { broadcast });
      return { signedTransaction: response };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      this.setIsBusy(false);
    }
  }

  async signWithTransitProvider(signOptions) {
    const { broadcast, chainNetwork, chainAccount, transaction, provider } = signOptions;
    // connect to wallet
    let response = await this.connectToTransitProvider({ provider, chainNetwork, chainAccount });
    const { transitWallet } = response;

    try {
      // sign with transit wallet
      this.setIsBusy(true);
      response = await transitWallet.eosApi.transact(
        {
          actions: [transaction]
        },
        {
          broadcast,
          blocksBehind: 3,
          expireSeconds: 60
        }
      );
    } catch (error) {
      throw error;
    } finally {
      this.setIsBusy(false);
    }

    return { signedTransaction: response };
  }

  // create a new user account that is managed by your app
  // this requires you to provide a wallet password (aka userPassword) on behalf of the user
  async custodialNewAccount(accountOptions) {
    const { apiKey, oreIdUrl, serviceKey } = this.options;
    const { accountType, email, name, picture, phone, userName, userPassword } = accountOptions;
    const body = { account_type: accountType, email, name, picture, phone, user_name: userName, user_password: userPassword };
    if (!serviceKey) {
      throw new Error('Missing serviceKey in oreId config options - required to call api/custodial/new-user.');
    }

    const url = `${oreIdUrl}/api/custodial/new-user`;
    const response = await axios.post(url,
      JSON.stringify(body),
      { headers: { 'Content-Type': 'application/json', 'api-key': apiKey, 'service-key': serviceKey },
        body
      });
    const { error } = response;
    if (error) {
      throw new Error(error);
    }
    return response.data;
  }

  // Call the migrate-account api
  // This api migrates a virtual account to a native account (on-chain)
  // This endpoint expects the account to be a managed (custodial) account
  // ... it requires you to provide a wallet password (aka userPassword) on behalf of the user
  async custodialMigrateAccount(migrateOptions) {
    const { apiKey, oreIdUrl, serviceKey } = this.options;
    if (!serviceKey) {
      throw new Error('Missing serviceKey in oreId config options - required to call api/custodial/migrate-account.');
    }

    const { account, chainAccount, chainNetwork, toType, userPassword } = migrateOptions;
    const body = { account, chain_account: chainAccount, chain_network: chainNetwork, to_type: toType, user_password: userPassword };

    const url = `${oreIdUrl}/api/custodial/migrate-account`;
    const response = await axios.post(url,
      JSON.stringify(body),
      { headers: { 'Content-Type': 'application/json', 'api-key': apiKey, 'service-key': serviceKey },
        body
      });
    const { error } = response;
    if (error) {
      throw new Error(error);
    }
    const { data } = response;
    const { account: newAccount } = data;
    return { account: newAccount };
  }

  async loginWithNonOreIdProvider(loginOptions) {
    const isUALProvider = this.isUALProvider(loginOptions.provider);
    return isUALProvider ? this.connectToUALProvider(loginOptions) : this.connectToTransitProvider(loginOptions);
  }

  async loginToUALProvider(wallet, chainNetwork, accountName) {
    try {
      const users = await wallet.login(accountName);
      return users;
    } catch (error) {
      const { message = '' } = error;
      if (message.includes('unknown key (boost::tuples::tuple')) {
        throw new Error(`The account selected by the wallet for login isn't on the ${chainNetwork} chain`);
      } else {
        throw error;
      }
    }
  }

  // TODO: We should cache the wallet/user object to avoid calling login everytime we need to sign
  async connectToUALProvider({ provider, chainNetwork = 'eos_main', accountName = '' }) {
    const SelectedProvider = this.options.ualProviders.find((ualProvider) => ualProvider.name.toLowerCase() === provider);
    if (SelectedProvider) {
      try {
        const networkConfig = await this.getNetworkConfig(chainNetwork);
        const ualNetworkConfig = {
          chainId: networkConfig.chainId,
          rpcEndpoints: [{
            ...networkConfig
          }]
        };
        const wallet = new SelectedProvider([ualNetworkConfig], { appName: this.options.appName });
        await wallet.init();
        const users = await this.loginToUALProvider(wallet, chainNetwork, accountName);

        if (!isNullOrEmpty(users)) {
          // TODO: Handle multiple users/permissions
          // UAL doesn't return the permission so we default to active
          const user = users[0];
          const publicKeys = await user.getKeys();
          const account = await user.getAccountName();
          const response = {
            isLoggedIn: true,
            account,
            permissions: [{ name: 'active', publicKey: publicKeys[0] }],
            provider,
            wallet,
            user
          };

          await this.updatePermissionsIfNecessary(response, ualNetworkConfig.chainId, provider);

          return response;
        }
      } catch (error) {
        console.log(`Failed to connect to ${provider} wallet:`, error);
        throw error;
      }
    } else {
      throw Error('Provider does not match');
    }
  }

  findAccountInDiscoverData(discoveryData, chainAccount) {
    const result = discoveryData.keyToAccountMap.find((data) => {
      return data.accounts.find((acct) => {
        return acct.account === chainAccount;
      });
    });

    if (result) {
      let authorization = 'active';

      // could active not exist?  If not, then just get first permission
      // this may be completely unecessary. remove if so.
      const active = result.accounts.find((acct) => {
        return acct.authorization === 'active';
      });

      if (!active) {
        const [first] = result.accounts;

        if (first) {
          authorization = first.authorization;
        }
      }

      return { index: result.index, key: result.key, authorization };
    }

    return null;
  }

  // This seems like a hack, but eos-transit only works if it's done this way
  // if you have scatter for example and you login with an account, the next time you login
  // no matter what you pass to login(), you will be logged in to that account
  // you have to logout first. But you don't want to logout unless the first account isn't the right one,
  // otherwise the user would have to login everytime.
  // the user in scatter has to make sure they pick the correct account when the login window comes up
  // this should be simpler, maybe will be resolved in a future eos-transit
  async doTransitProviderLogin(transitWallet, chainAccount, provider, retryCount = 0) {
    let info = {};

    switch (provider) {
      case 'ledger':
        {
          // we have to discover on ledger since we don't know the index of the account
          const discoveryData = await transitWallet.discover({
            pathIndexList: [0, 1, 2] // this is slow, not sure if we should go past 3
          });

          const foundData = this.findAccountInDiscoverData(discoveryData, chainAccount);
          if (foundData) {
            info = await transitWallet.login(chainAccount, foundData.authorization, foundData.index, foundData.key);
          } else {
            throw new Error(`Account ${chainAccount} not found on Ledger`);
          }
        }
        break;
      case 'scatter':
      default:
        info = await transitWallet.login(chainAccount);
        break;
    }

    if (retryCount > 2) {
      // don't get stuck in a loop, let the transaction fail so the user will figure it out
      return;
    }
    if (chainAccount && info.account_name !== chainAccount) {
      // keep trying until the user logs in with the correct wallet
      // in scatter, it will ask you to choose an account if you logout and log back in
      // we could also call discover and login to the matching account and that would avoid a step
      await transitWallet.logout();
      this.doTransitProviderLogin(transitWallet, chainAccount, provider, retryCount + 1);
    }
  }

  async loginToTransitProvider(transitWallet, provider, chainNetwork, chainAccount = null) {
    try {
      // if the default login is for a different account
      await this.doTransitProviderLogin(transitWallet, chainAccount, provider);
    } catch (error) {
      const { message = '' } = error;
      if (message.includes('unknown key (boost::tuples::tuple')) {
        throw new Error(`The account selected by the wallet for login isn't on the ${chainNetwork} chain`);
      } else {
        throw error;
      }
    } finally {
      await this.waitWhileWalletIsBusy(transitWallet, provider);
    }
  }

  // throws and error on failure
  async setupTransitWallet({ provider, chainNetwork }) {
    const providerId = transitProviderAttributes[provider].providerId;
    const chainContext = await this.getOrCreateChainContext(chainNetwork);
    const transitProvider = chainContext.getWalletProviders().find((wp) => wp.id === providerId);
    const transitWallet = chainContext.initWallet(transitProvider);

    try {
      await transitWallet.connect();
      await this.waitWhileWalletIsBusy(transitWallet, provider);

      return transitWallet;
    } catch (error) {
      console.log(`Failed to connect to ${provider}`, error);
      throw new Error(`Failed to connect to ${provider}`);
    }
  }

  // chainAccount is needed since login will try to use the default account (in scatter)
  // and it wil fail to sign the transaction
  async connectToTransitProvider({ provider, chainNetwork = 'eos_main', chainAccount = null }) {
    let response;

    try {
      const transitWallet = await this.setupTransitWallet({ provider, chainNetwork });

      response = { transitWallet, provider };

      await transitWallet.connect();
      await this.waitWhileWalletIsBusy(transitWallet, provider);

      // some providers require login flow to connect (usually this means connect() does nothing but login selects an account)
      if (transitProviderAttributes[provider].requiresLogin) {
        // if connected, but not authenticated, then login
        if (!transitWallet.authenticated) {
          await this.loginToTransitProvider(transitWallet, provider, chainNetwork, chainAccount);
        }
      }

      // If connecting also performs login
      // return login results or throw error
      if (transitWallet.connected) {
        if (transitWallet.authenticated) {
          const { accountName, permission, publicKey } = transitWallet.auth;
          response = {
            isLoggedIn: true,
            account: accountName,
            permissions: [{ name: permission, publicKey }], // todo: add parent permission when available
            ...response
          };
        }
      } else {
        let errorString = `${provider} not connected!`;
        const { hasError, errorMessage } = transitWallet;

        if (hasError) {
          errorString += ` Error: ${errorMessage}`;
        }

        throw new Error(errorString);
      }

      if (transitWallet.eosApi) {
        const chainId = transitWallet.eosApi.chainId;
        await this.updatePermissionsIfNecessary(response, chainId, provider);
      }
    } catch (error) {
      console.log(`Failed to connect to ${provider} wallet:`, error);
      throw error;
    } finally {
      this.setIsBusy(false);
    }

    return response;
  }

  async waitWhileWalletIsBusy(transitWallet, provider) {
    while (transitWallet.inProgress) {
      this.setIsBusy(true);
      // todo: add timeout
      await Helpers.sleep(250);
      console.log(`connecting to ${provider} via eos-transit wallet in progress:`, transitWallet.inProgress);
    }
    this.setIsBusy(false);
  }

  async getChainNetworkByChainId(chainId) {
    const networks = await this.chainNetworks();
    const chainConfig = networks.find((n) => n.hosts.find((h) => h.chainId === chainId));

    if (!isNullOrEmpty(chainConfig)) {
      return chainConfig.network;
    }
  }

  async getChainNetworkFromTransitWallet(transitWallet) {
    if (transitWallet && transitWallet.eosApi) {
      const chainId = transitWallet.eosApi.chainId;

      const networks = await this.chainNetworks();

      const chainConfig = networks.find((n) => n.hosts.find((h) => h.chainId === chainId));
      if (!isNullOrEmpty(chainConfig)) {
        return chainConfig.network;
      }
    }
  }

  // Discover all accounts (and related permissions) in the wallet and add them to ORE ID
  // Note: Most wallets don't support discovery (as of April 2019)
  async discoverCredentialsInWallet(chainNetwork, provider, oreAccount, discoveryPathIndexList = [0, 1, 2]) {
    let accountsAndPermissions = [];

    try {
      // we don't need to login or anything else just to discover, may be faster than calling connectToTransitProvider
      const transitWallet = await this.setupTransitWallet({ provider, chainNetwork });

      this.setIsBusy(true);
      const discoveryData = await transitWallet.discover({
        pathIndexList: discoveryPathIndexList
      });

      // this data looks like this: keyToAccountMap[accounts[{account,permission}]] - e.g. keyToAccountMap[accounts[{'myaccount':'owner','myaccount':'active'}]]
      const credentials = discoveryData.keyToAccountMap;

      // You can't use forEach or other loop function with await (unless you know what you're doing)
      for (let i = 0; i < credentials.length; i += 1) {
        const credential = credentials[i];

        const { accounts = [] } = credential;
        if (accounts.length > 0) {
          const { account, authorization } = accounts[0];
          const permissions = [
            {
              account,
              publicKey: credential.key,
              name: authorization,
              parent: null
            }
          ];
          const chainNetworkToUpdate = await this.getChainNetworkFromTransitWallet(transitWallet);
          await this.addWalletPermissionstoOreIdAccount(account, chainNetworkToUpdate, permissions, oreAccount, provider);
          accountsAndPermissions = accountsAndPermissions.concat(permissions);
        }
      }
    } catch (error) {
      throw error;
    } finally {
      this.setIsBusy(false);
    }
    // return a list of account names and related permissions found
    return accountsAndPermissions;
  }

  setIsBusy(value) {
    if (this.isBusy !== value) {
      this.isBusy = value;
      if (this.options.setBusyCallback) {
        this.options.setBusyCallback(value);
      }
    }
  }

  async updatePermissionsIfNecessary(response, chainId, provider) {
    // if an account is selected, add it to the ORE ID account (if not already there)
    const oreAccount = this.localState.accountName();
    if (oreAccount) {
      const { account, permissions } = response;
      const chainNetworkToUpdate = await this.getChainNetworkByChainId(chainId);
      await this.addWalletPermissionstoOreIdAccount(account, chainNetworkToUpdate, permissions, oreAccount, provider);
    } else {
      console.log('updatePermissionsIfNecessary: users account name is null');
    }
  }

  // for each permission in the wallet, add to ORE ID (if not in user's record)
  async addWalletPermissionstoOreIdAccount(chainAccount, chainNetwork, walletPermissions, oreAccount, provider) {
    if (isNullOrEmpty(oreAccount) || isNullOrEmpty(walletPermissions) || isNullOrEmpty(chainNetwork)) {
      return;
    }

    const theUser = await this.getUser(oreAccount);

    await walletPermissions.map(async (p) => {
      const permission = p.name;
      let parentPermission = p.parent; // pooky
      if (!parentPermission) {
        // HACK: assume parent permission - its missing from the discover() results
        parentPermission = 'active';

        if (permission === 'owner') {
          parentPermission = '';
        } else if (permission === 'active') {
          parentPermission = 'owner';
        }
      }
      // filter out permission that the user already has in his record
      const skipThisPermission = theUser.permissions.some((up) => (up.chainAccount === chainAccount && up.chainNetwork === chainNetwork && up.permission === permission) || permission === 'owner');

      // don't add 'owner' permission and skip ones that are already stored in user's account
      if (skipThisPermission !== true) {
        // let publicKey = p.required_auth.keys[0].key; //TODO: Handle multiple keys and weights
        const publicKey = p.publicKey;
        await this.addPermission(oreAccount, chainAccount, chainNetwork, publicKey, parentPermission, permission, provider);
      }
    });

    // reload user to get updated permissions
    await this.getUser(oreAccount);
  }

  helpTextForProvider(provider) {
    // same provider name exists in both lists
    // so we check what was passed in by the client
    if (supportedTransitProviders.includes(provider)) {
      return transitProviderAttributes[provider].helpText;
    }

    if (supportedUALProviders.includes(provider)) {
      return ualProviderAttributes[provider].helpText;
    }

    return null;
  }

  // Validates startup options
  validateOptions(options) {
    const { appId, apiKey, oreIdUrl } = options;
    let errorMessage = '';

    if (!appId) {
      errorMessage += '\n --> Missing required parameter - appId. You can get an appId when you register your app with ORE ID.';
    }
    if (!apiKey) {
      errorMessage += '\n --> Missing required parameter - apiKey. You can get an apiKey when you register your app with ORE ID.';
    }
    if (!oreIdUrl) {
      errorMessage += '\n --> Missing required parameter - oreIdUrl. Refer to the docs to get this value.';
    }
    if (errorMessage !== '') {
      throw new Error(`Options are missing or invalid. ${errorMessage}`);
    }

    this.options = options;
  }

  // load user from local storage and call api to get latest info
  // if you don't pass in an accountName, the cached user is returned
  async getUser(accountName = null) {
    if (accountName) {
      // stores user in the local state, we must await for return to work
      await this.getUserInfoFromApi(accountName);
    }

    return this.localState.user();
  }

  // Loads settings value from the server
  // e.g. configType='chains' returns valid chain types and addresses
  async getConfig(configType) {
    return this.getConfigFromApi(configType);
  }

  // Gets a single-use token to access the service
  async getAccessToken() {
    await this.getNewAppAccessToken(); // call api
    return this.appAccessToken;
  }

  // Returns a fully formed url to call the auth endpoint
  async getOreIdAuthUrl(args) {
    const { code, email, phone, provider, callbackUrl, backgroundColor, state } = args;
    const { oreIdUrl } = this.options;

    if (!provider || !callbackUrl) {
      throw new Error('Missing a required parameter');
    }

    const appAccessToken = await this.getAccessToken();

    // optional params
    const encodedStateParam = state ? `&state=${state}` : '';
    // handle passwordless params
    const codeParam = code ? `&code=${code}` : '';
    const emailParam = email ? `&email=${email}` : '';
    let phoneParam = '';

    if (phone) {
      // if user passes in +12103334444, the plus sign needs to be URL encoded
      const encodedPhone = encodeURIComponent(phone);

      phoneParam = `&phone=${encodedPhone}`;
    }

    return (
      `${oreIdUrl}/auth#app_access_token=${appAccessToken}&provider=${provider}` +
      `${codeParam}${emailParam}${phoneParam}` +
      `&callback_url=${encodeURIComponent(callbackUrl)}&background_color=${encodeURIComponent(backgroundColor)}${encodedStateParam}`
    );
  }

  // Returns a fully formed url to call the sign endpoint
  // chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_jungle', 'eos_kylin', 'ore_main', 'eos_test', etc.
  async getOreIdSignUrl(signOptions) {
    const { account, allowChainAccountSelection, broadcast, callbackUrl, chainNetwork, provider, returnSignedTransaction, state, transaction, userPassword } = signOptions;
    let { chainAccount } = signOptions;
    const { oreIdUrl } = this.options;

    if (!account || !callbackUrl || !transaction) {
      throw new Error('Missing a required parameter');
    }

    // default chainAccount is the same as the user's account
    if (!chainAccount) {
      chainAccount = account;
    }

    const appAccessToken = await this.getAccessToken();
    const encodedTransaction = Helpers.base64Encode(transaction);
    let optionalParams = state ? `&state=${state}` : '';
    optionalParams += !isNullOrEmpty(allowChainAccountSelection) ? `&allow_chain_account_selection=${allowChainAccountSelection}` : '';
    optionalParams += !isNullOrEmpty(returnSignedTransaction) ? `&return_signed_transaction=${returnSignedTransaction}` : '';
    optionalParams += !isNullOrEmpty(userPassword) ? `&user_password=${userPassword}` : '';

    // prettier-ignore
    return `${oreIdUrl}/sign#app_access_token=${appAccessToken}&account=${account}&broadcast=${broadcast}&callback_url=${encodeURIComponent(callbackUrl)}&chain_account=${chainAccount}&chain_network=${encodeURIComponent(chainNetwork)}&transaction=${encodedTransaction}${optionalParams}`;
  }

  // Extracts the response parameters on the /auth callback URL string
  handleAuthResponse(callbackUrlString) {
    // Parses error codes and returns an errors array
    // (if there is an error_code param sent back - can have more than one error code - seperated by a ‘&’ delimeter
    // NOTE: accessToken and idToken are not usually returned from the ORE ID service - they are included here for future support
    const params = Helpers.urlParamsToArray(callbackUrlString);
    const { accessToken, account, idToken, state } = params;
    const errors = this.getErrorCodesFromParams(params);
    const response = { account };
    if (accessToken) response.accessToken = accessToken;
    if (idToken) response.idToken = idToken;
    if (errors) response.errors = errors;
    if (state) response.state = state;
    this.setIsBusy(false);
    return response;
  }

  // Extracts the response parameters on the /sign callback URL string
  handleSignResponse(callbackUrlString) {
    let signedTransaction;
    const params = Helpers.urlParamsToArray(callbackUrlString);
    const { signed_transaction: encodedTransaction, state, transaction_id: transactionId } = params;
    const errors = this.getErrorCodesFromParams(params);

    if (!errors) {
      // Decode base64 parameters
      signedTransaction = Helpers.base64DecodeSafe(encodedTransaction);
    }
    this.setIsBusy(false);
    return { signedTransaction, state, transactionId, errors };
  }

  // Calls the {oreIDUrl}/api/app-token endpoint to get the appAccessToken
  async getNewAppAccessToken() {
    const responseJson = await this.callOreIdApi('app-token');
    const { appAccessToken } = responseJson;
    this.appAccessToken = appAccessToken;
  }

  // Get the user info from ORE ID for the given user account
  // we should just standardize on getUser(), I think the demo app calls this
  async getUserInfoFromApi(account) {
    const userInfo = await this.callOreIdApi(`account/user?account=${account}`);
    this.localState.saveUser(userInfo);

    return userInfo;
  }

  // Get the config (setting) values of a specific type
  async getConfigFromApi(configType) {
    if (!configType) {
      throw new Error('Missing a required parameter: configType');
    }
    const responseJson = await this.callOreIdApi(`services/config?type=${configType}`);
    const results = responseJson;
    const { values } = results || {};
    if (!values) {
      throw new Error(`Not able to retrieve config values for ${configType}`);
    }
    return values;
  }

  // Adds a public key to an account with a specific permission name
  // The permission name must be one defined in the App Registration record (Which defines its parent permission as well as preventing adding rougue permissions)
  // This feature allows your app to hold private keys locally (for certain actions enabled by the permission) while having the associated public key in the user's account
  // chainAccount = name of the account on the chain - 12/13-digit string on EOS and Ethereum Address on ETH - it may be the same as the account
  // chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_jungle', 'eos_kylin", 'ore_main', 'eos_test', etc.
  async addPermission(account, chainAccount, chainNetwork, publicKey, parentPermission, permission, provider) {
    let optionalParams = provider ? `&wallet-type=${provider}` : '';
    optionalParams += parentPermission ? `&parent-permission=${parentPermission}` : '';
    await this.callOreIdApi(`account/add-permission?account=${account}&chain-account=${chainAccount}&chain-network=${chainNetwork}&permission=${permission}&public-key=${publicKey}${optionalParams}`);
    // if failed, error will be thrown
  }

  // Helper function to call api endpoint and inject api-key
  async callOreIdApi(endpointAndParams) {
    const { apiKey, oreIdUrl } = this.options;
    const url = `${oreIdUrl}/api/${endpointAndParams}`;

    const response = await axios.get(url, {
      headers: { 'api-key': apiKey }
    });
    const { error } = response;
    if (error) {
      throw new Error(error);
    }

    return response.data;
  }

  //  Params is a javascript object representing the parameters parsed from an URL string
  getErrorCodesFromParams(params) {
    let errorCodes;
    const errorString = params.error_code;
    const errorMessage = params.error_message;
    if (errorString) {
      errorCodes = errorString.split(/[/?/$&]/);
    }
    if (errorCodes || errorMessage) {
      errorCodes = errorCodes || [];
      errorCodes.push(errorMessage);
    }
    return errorCodes;
  }

  // We don't really maintain a logged-in state
  // However, we do have local cached user data, so clear that
  logout() {
    this.localState.clear();
  }

  isCustodial(provider) {
    return provider === PROVIDER_TYPE.custodial;
  }

  isUALProvider(provider) {
    const { ualProviders } = this.options;
    return ualProviders && ualProviders.find((ualProvider) => ualProvider.name.toLowerCase() === provider.toLowerCase());
  }

  getWalletProviderInfo(provider, type) {
    if (!provider || !type) {
      return {
        ualProviderAttributes,
        transitProviderAttributes
      };
    }

    if (type.toLowerCase() === PROVIDER_TYPE.transit) {
      return transitProviderAttributes[provider];
    }

    if (type.toLowerCase() === PROVIDER_TYPE.ual) {
      return ualProviderAttributes[provider];
    }
  }
}
