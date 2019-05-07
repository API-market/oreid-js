import axios from 'axios';
import { initAccessContext } from 'eos-transit';
import Helpers from './helpers';
import StorageHandler from './storage';

const providerAttributes = {
  ledger: {
    providerId: 'ledger',
    requiresLogin: false,
    supportsDiscovery: true,
  },
  lynx: {
    providerId: 'EOS Lynx',
    requiresLogin: false,
    supportsDiscovery: false,
  },
  meetone: {
    providerId: 'meetone_provider',
    requiresLogin: false,
    supportsDiscovery: false,
  },
  metro: {
    providerId: 'metro',
    requiresLogin: false,
    supportsDiscovery: false,
  },
  scatter: {
    providerId: 'scatter',
    requiresLogin: true,
    supportsDiscovery: false,
  },
  tokenpocket: {
    providerId: 'TokenPocket',
    requiresLogin: false,
    supportsDiscovery: false,
  },
};

export default class OreId {
  constructor(options) {
    this.options = null;
    this.appAccessToken = null;
    this.user = null;
    this.storage = new StorageHandler();
    this.validateOptions(options);
    this.chainContexts = {};
    this.chainNetworks = [];
    this.init(); // todo: handle multiple networks
  }

  // Initialize the library
  async init() {
    // load the chainNetworks list from the ORE ID API
    const results = await this.getConfigFromApi('chains');
    this.chainNetworks = results.chains;
  }

  getOrCreateChainContext(chainNetwork) {
    const { appName, eosTransitWalletProviders = [] } = this.options;
    if (this.chainContexts[chainNetwork]) {
      return this.chainContexts[chainNetwork];
    }

    const chainConfig = this.chainNetworks.find((n) => n.network === chainNetwork);
    if (!chainConfig) {
      throw new Error(`Invalid chain network: ${chainNetwork}.`);
    }

    const { hosts } = chainConfig;
    const { chainId, host, port, protocol } = hosts[0]; // using first host
    const NETWORK_CONFIG = { host, port, protocol, chainId };

    // create context
    const chainContext = initAccessContext({
      appName: appName || 'missing appName',
      network: NETWORK_CONFIG,
      walletProviders: eosTransitWalletProviders,
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
      url += `&phone=${phone}`;
    }

    if (verify) {
      url += `&code=${code}`;
    }

    let response = {};
    try {
      response = await axios.get(url, {
        headers: { 'api-key': apiKey },
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
    const { provider, chainNetwork = 'eos_main' } = loginOptions;
    // handle log-in based on type
    switch (provider) {
      case 'ledger':
        return this.connectToTransitProvider(provider, chainNetwork);
      case 'lynx':
        return this.connectToTransitProvider(provider, chainNetwork);
      case 'meetone':
        return this.connectToTransitProvider(provider, chainNetwork);
      case 'metro':
        throw new Error('Not Implemented');
      // return this.connectToTransitProvider(provider, chainNetwork);
      case 'scatter':
        return this.connectToTransitProvider(provider, chainNetwork);
      case 'tokenpocket':
        return this.connectToTransitProvider(provider, chainNetwork);
      default:
        // assume ORE ID if not one of the others
        return this.loginWithOreId(loginOptions);
    }
  }

  // sign transaction with keys in wallet - connect to wallet first
  async sign(signOptions) {
    // handle sign transaction based on provider type
    const { provider } = signOptions;
    switch (provider) {
      case 'lynx':
        return this.signWithTransitProvider(signOptions);
      case 'ledger':
        return this.signWithTransitProvider(signOptions);
      case 'meetone':
        return this.signWithTransitProvider(signOptions);
      case 'metro':
        break;
      case 'scatter':
        return this.signWithTransitProvider(signOptions);
      case 'tokenpocket':
        return this.signWithTransitProvider(signOptions);
      default:
        // assume ORE ID if not one of the others
        return this.signWithOreId(signOptions);
    }
  }

  // connect to wallet and discover keys
  // any new keys discovered in wallet are added to user's ORE ID record
  async discover(discoverOptions) {
    const { provider, chainNetwork = 'eos_main', discoveryPathIndexList } = discoverOptions;
    this.assertValidProvider(provider);
    if (this.canDiscover(provider)) {
      return this.discoverCredentialsInWallet(chainNetwork, provider, discoveryPathIndexList);
    }
    throw new Error(`Discover not support for provider: ${provider}`);
  }

  // throw error if invalid provider
  assertValidProvider(provider) {
    if (providerAttributes[provider]) {
      return true;
    }
    throw new Error(`Provider ${provider} is not a valid option`);
  }

  // determine whether discovery is supported by the provider
  canDiscover(provider) {
    return providerAttributes[provider].supportsDiscovery === true;
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
      state,
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

  async signWithTransitProvider(signOptions) {
    const { broadcast, chainNetwork, transaction, provider } = signOptions;
    // connect to wallet
    let response = await this.connectToTransitProvider(provider, chainNetwork);
    const { transitWallet } = response;

    try {
      // sign with transit wallet
      this.setIsBusy(true);
      response = await transitWallet.eosApi.transact(
        {
          actions: [transaction],
        },
        {
          broadcast,
          blocksBehind: 3,
          expireSeconds: 60,
        },
      );
    } catch (error) {
      throw error;
    } finally {
      this.setIsBusy(false);
    }

    return { signedTransaction: response };
  }

  async connectToTransitProvider(provider, chainNetwork) {
    let response = {};
    const providerId = providerAttributes[provider].providerId;
    const chainContext = this.getOrCreateChainContext(chainNetwork);
    const transitProvider = chainContext.getWalletProviders().find((wp) => wp.id === providerId);
    const transitWallet = chainContext.initWallet(transitProvider);

    try {
      await transitWallet.connect();
      // try to connect to wallet
      await this.waitWhileWalletIsBusy(transitWallet, provider);

      // some providers require login flow to connect (usually this means connect() does nothing but login selects an account)
      if (providerAttributes[provider].requiresLogin === true) {
        // if connected, but not authenticated, then login
        if (transitWallet && transitWallet.authenticated !== true) {
          await transitWallet.login(); // todo: pass along account and permission param to login()
          await this.waitWhileWalletIsBusy(transitWallet, provider);
        }
        if (!transitWallet || transitWallet.authenticated !== true) {
          throw new Error(`Couldn't connect to ${provider}`);
        }
      }

      // at least, return the wallet
      response.transitWallet = transitWallet;
      // For some wallets, connecting also performs login
      // return login results or throw error
      if (transitWallet.connected) {
        if (transitWallet.authenticated) {
          const { accountName, permission, publicKey } = transitWallet.auth;
          response = {
            isLoggedIn: transitWallet.authenticated,
            account: accountName,
            permissions: [{ name: permission, publicKey }], // todo: add parent permission when available
            provider,
            transitWallet,
          };
        }
      } else {
        const { hasError, errorMessage } = transitWallet;
        throw new Error(`${provider} not connected!${hasError}` ? ` Error: ${errorMessage}` : '');
      }

      // if an account is selected, add it to the ORE ID account (if not already there)
      const userOreAccount = (this.user || {}).accountName;
      if (userOreAccount) {
        const { account: chainAccount, permissions } = response;
        const chainNetworkToUpdate = this.getChainNetworkFromTransitWallet(transitWallet);
        await this.addWalletPermissionstoOreIdAccount(chainAccount, chainNetworkToUpdate, permissions, userOreAccount, provider);
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

  getChainNetworkFromTransitWallet(transitWallet) {
    let chainNetwork;
    if (transitWallet && transitWallet.eosApi) {
      const chainId = transitWallet.eosApi.chainId;
      const chainConfig = this.chainNetworks.find((n) => n.hosts.find((h) => h.chainId === chainId));
      if (!Helpers.isNullOrEmpty(chainConfig)) {
        chainNetwork = chainConfig.network;
      }
    }
    return chainNetwork;
  }

  // Discover all accounts (and related permissions) in the wallet and add them to ORE ID
  // Note: Most wallets don't support discovery (as of April 2019)
  async discoverCredentialsInWallet(chainNetwork, provider, discoveryPathIndexList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let accountsAndPermissions = [];
    try {
      let permissions;
      const { transitWallet } = await this.connectToTransitProvider(provider, chainNetwork);
      if (!transitWallet) {
        return accountsAndPermissions;
      }
      this.setIsBusy(true);
      const discoveryData = await transitWallet.discover({
        pathIndexList: discoveryPathIndexList,
      });
      // add accounts to ORE ID - if ORE ID user account is known
      const userOreAccount = (this.user || {}).accountName;
      // this data looks like this: keyToAccountMap[accounts[{account,permission}]] - e.g. keyToAccountMap[accounts[{'myaccount':'owner','myaccount':'active'}]]
      const credentials = discoveryData.keyToAccountMap;
      await credentials.forEach(async (credential) => {
        const { accounts = [] } = credential;
        if (accounts.length > 0) {
          const { account, authorization } = accounts[0];
          permissions = [
            {
              account,
              publicKey: credential.key,
              name: authorization,
              parent: null,
            },
          ];
          const chainNetworkToUpdate = this.getChainNetworkFromTransitWallet(transitWallet);
          await this.addWalletPermissionstoOreIdAccount(account, chainNetworkToUpdate, permissions, userOreAccount, provider);
          accountsAndPermissions = accountsAndPermissions.concat(permissions);
        }
      });
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

  // for each permission in the wallet, add to ORE ID (if not in user's record)
  async addWalletPermissionstoOreIdAccount(chainAccount, chainNetwork, walletPermissions, userOreAccount, provider) {
    if (Helpers.isNullOrEmpty(userOreAccount) || Helpers.isNullOrEmpty(walletPermissions) || Helpers.isNullOrEmpty(chainNetwork)) {
      return;
    }
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
      const skipThisPermission = this.user.permissions.some((up) => (up.chainAccount === chainAccount && up.chainNetwork === chainNetwork && up.permission === permission) || permission === 'owner');

      // don't add 'owner' permission and skip ones that are already stored in user's account
      if (skipThisPermission !== true) {
        // let publicKey = p.required_auth.keys[0].key; //TODO: Handle multiple keys and weights
        const publicKey = p.publicKey;
        await this.addPermission(userOreAccount, chainAccount, chainNetwork, publicKey, parentPermission, permission, provider);
      }
    });
    // reload user to get updated permissions
    await this.getUserInfoFromApi(userOreAccount);
  }

  /*
        Validates startup options
    */
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

  /*
        load user from local storage and call api to get latest info
    */
  async getUser(account) {
    if (account) {
      const user = await this.getUserInfoFromApi(account); // get the latest user data
      return user;
    }
    // Check in state
    if (this.user) {
      return this.user;
    }
    // Check local storage
    const result = this.loadUserLocally();
    return result;
  }

  /*
        Loads settings value from the server
        e.g. configType='chains' returns valid chain types and addresses
    */
  async getConfig(configType) {
    return this.getConfigFromApi(configType);
  }

  /*
        Checks for the expiration of the locally cached app-access-token
        Refreshes token if needed using getNewAppAccessTokenFromApi()
    */
  async getAccessToken() {
    // check for expiration and renew token if expired
    if (!this.appAccessToken || Helpers.tokenHasExpired(this.appAccessToken)) {
      await this.getNewAppAccessToken(); // call api
    }
    return this.appAccessToken;
  }

  /*
        Returns a fully formed url to call the auth endpoint
  */
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
    const phoneParam = phone ? `&phone=${phone}` : '';

    return (
      `${oreIdUrl}/auth#app_access_token=${appAccessToken}&provider=${provider}` +
      `${codeParam}${emailParam}${phoneParam}` +
      `&callback_url=${encodeURIComponent(callbackUrl)}&background_color=${backgroundColor}${encodedStateParam}`
    );
  }

  /*
      Returns a fully formed url to call the sign endpoint
      chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_jungle', 'eos_kylin', 'ore_main', 'eos_test', etc.
  */
  async getOreIdSignUrl(signOptions) {
    const { account, broadcast, callbackUrl, chainNetwork, state, transaction, accountIsTransactionPermission } = signOptions;

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
    optionalParams += accountIsTransactionPermission ? `&account_is_transaction_permission=${accountIsTransactionPermission}` : '';

    return `${oreIdUrl}/sign#app_access_token=${appAccessToken}&account=${account}&broadcast=${broadcast}&callback_url=${encodeURIComponent(
      callbackUrl,
    )}&chain_account=${chainAccount}&chain_network=${chainNetwork}&transaction=${encodedTransaction}${optionalParams}`;
  }

  /*
      Extracts the response parameters on the /auth callback URL string
  */
  handleAuthResponse(callbackUrlString) {
    // Parses error codes and returns an errors array
    // (if there is an error_code param sent back - can have more than one error code - seperated by a ‘&’ delimeter
    const params = Helpers.urlParamsToArray(callbackUrlString);
    const { account, state } = params;
    const errors = this.getErrorCodesFromParams(params);
    this.setIsBusy(false);
    return { account, state, errors };
  }

  /*
      Extracts the response parameters on the /sign callback URL string
  */
  handleSignResponse(callbackUrlString) {
    let signedTransaction;
    const params = Helpers.urlParamsToArray(callbackUrlString);
    const { signed_transaction: encodedTransaction, state } = params;
    const errors = this.getErrorCodesFromParams(params);

    if (!errors) {
      // Decode base64 parameters
      signedTransaction = Helpers.base64DecodeSafe(encodedTransaction);
    }
    this.setIsBusy(false);
    return { signedTransaction, state, errors };
  }

  /*
      Calls the {oreIDUrl}/api/app-token endpoint to get the appAccessToken
  */
  async getNewAppAccessToken() {
    const responseJson = await this.callOreIdApi('app-token');
    const { appAccessToken } = responseJson;
    this.appAccessToken = appAccessToken;
    // const decodedToken = Helpers.jwtDecodeSafe(appAccessToken)
    // const APPID_CLAIM_URI = 'https://oreid.aikon.com/appId'
    // this.appId = decodedToken[APPID_CLAIM_URI]; //Get the appId from the app token
  }

  /*
      Get the user info from ORE ID for the given user account
  */
  async getUserInfoFromApi(account) {
    const responseJson = await this.callOreIdApi(`account/user?account=${account}`);
    const userInfo = responseJson;
    this.saveUserLocally(userInfo);
    await this.loadUserLocally(); // ensures this.user state is set
    return userInfo;
  }

  /*
      Get the config (setting) values of a specific type
  */
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

  /*
      Adds a public key to an account with a specific permission name
      The permission name must be one defined in the App Registration record (Which defines its parent permission as well as preventing adding rougue permissions)
      This feature allows your app to hold private keys locally (for certain actions enabled by the permission) while having the associated public key in the user's account
      chainAccount = name of the account on the chain - 12/13-digit string on EOS and Ethereum Address on ETH - it may be the same as the account
      chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_jungle', 'eos_kylin", 'ore_main', 'eos_test', etc.
  */
  async addPermission(account, chainAccount, chainNetwork, publicKey, parentPermission, permission, provider) {
    let optionalParams = provider ? `&wallet-type=${provider}` : '';
    optionalParams += parentPermission ? `&parent-permission=${parentPermission}` : '';
    await this.callOreIdApi(`account/add-permission?account=${account}&chain-account=${chainAccount}&chain-network=${chainNetwork}&permission=${permission}&public-key=${publicKey}${optionalParams}`);
    // if failed, error will be thrown
  }

  /*
      Get the user info from ORE ID for the given user account
  */
  async getUserWalletInfo(account) {
    throw Error('Not Implemented');
    // let responseJson = await this.callOreIdApi(`wallet?account=${account}`)
    // let userWalletInfo = responseJson;
    // return {userWalletInfo, errors};
  }

  /*
      Helper function to call api endpoint and inject api-key
  */
  async callOreIdApi(endpointAndParams) {
    const { apiKey, oreIdUrl } = this.options;
    const url = `${oreIdUrl}/api/${endpointAndParams}`;
    const response = await axios.get(url, {
      headers: { 'api-key': apiKey },
    });

    const { error } = response;
    if (error) {
      throw new Error(error);
    }
    return response.data;
  }

  /*
      Params is a javascript object representing the parameters parsed from an URL string
  */
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

  /*
      We don't really maintain a logged-in state
      However, we do have local cached user data, so clear that
  */
  logout() {
    // clear local state
    this.clearLocalState();
  }

  /*
      Local state
  */

  userKey() {
    return `oreid.${this.options.appId}.user`;
  }

  saveUserLocally(user) {
    if (Helpers.isNullOrEmpty(user)) {
      return;
    }
    this.user = user;
    const serialized = JSON.stringify(this.user);
    this.storage.setItem(this.userKey(), serialized);
  }

  loadUserLocally() {
    const serialized = this.storage.getItem(this.userKey());
    // user state does not exist
    if (Helpers.isNullOrEmpty(serialized)) {
      this.user = null;
      return null;
    }
    this.user = JSON.parse(serialized);
    return this.user;
  }

  async clearLocalState() {
    this.storage.removeItem(this.userKey());
  }
}
