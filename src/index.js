const { base64DecodeSafe, isNullOrEmpty, jwtDecodeSafe, log, sleep, tokenHasExpired, tryParseJSON, urlParamsToArray } = require("./helpers.js");
// const StorageHandler = require("./storage.js");
const Base64 = require('js-base64').Base64;
const fetch = require('node-fetch');
import StorageHandler from './storage';
import { initAccessContext } from 'eos-transit';
import scatterProvider from 'eos-transit-scatter-provider';
import ledgerProvider from 'eos-transit-ledger-provider'
import lynxProvider from 'eos-transit-lynx-provider';
import meetoneProvider from 'eos-transit-meetone-provider';
import tokenpocketProvider from 'eos-transit-tokenpocket-provider';

const APPID_CLAIM_URI = "https://oreid.aikon.com/appId";

const providerNameMap = {
    'ledger' : 'ledger',
    'lynx' : 'EOS Lynx',
    'meetone' : 'meetone_provider',
    'metro' : 'metro',
    'scatter': 'scatter',
    'tokenpocket': 'TokenPocket'
}

class OreId {

    constructor(options) {
        this.options;
        this.appAccessToken;
        this.user;
        this.storage = new StorageHandler();
        this.validateOptions(options);
        this.chainContexts = {};
        this.chainNetworks = [];
        this.init(); //todo: handle multiple networks
    }

    //Initialize the library
    async init() {
        //load the chainNetworks list from the ORE ID API
        let results = await this.getConfigFromApi('chains');
        this.chainNetworks = results.chains;
    }

    getOrCreateChainContext(chainNetwork) {
        let { appName } = this.options;
        if(this.chainContexts[chainNetwork]) {
            return this.chainContexts[chainNetwork];
        }

        let chainConfig = this.chainNetworks.find(n => n.network === chainNetwork);
        if(!chainConfig) {
            throw new Error(`Invalid chain network: ${chainNetwork}.`);
        }

        let {hosts} = chainConfig;
        let {chainId, host, port, protocol} = hosts[0]; //using first host
        const NETWORK_CONFIG = { host , port, protocol, chainId };

        //create context
        let chainContext = initAccessContext({
            appName: appName || 'missing appName',
            network: NETWORK_CONFIG,
            walletProviders: [
                scatterProvider(),
                ledgerProvider({ pathIndexList: [ 0, 1, 2, 35 ] }),
                lynxProvider(),
                meetoneProvider(),
                tokenpocketProvider(),
            ]
        });
        //cache for future use
        this.chainContexts[chainNetwork] = chainContext;
        return chainContext;
    }

    async login(loginOptions, chainNetwork = 'eos_main') {
        let { provider } = loginOptions;
        //handle log-in based on type
        switch (provider) {
            case 'ledger':
                return this.connectToTransitProvider(provider, chainNetwork);
                break;
            case 'lynx':
                return this.connectToTransitProvider(provider, chainNetwork);
                break;
            case 'meetone':
                return this.connectToTransitProvider(provider, chainNetwork);
                break;
            case 'metro':
                throw new Error('Not Implemented');
                //return this.connectToTransitProvider(provider, chainNetwork); 
                break;
            case 'scatter':
                return this.connectToTransitProvider(provider, chainNetwork);
                break;
            case 'tokenpocket':
                return this.connectToTransitProvider(provider, chainNetwork);
                break;
            default:
                //assume ORE ID if not one of the others
                return this.loginWithOreId(provider);
            break;
        }
    }

    //sign transaction with keys in wallet - connect to wallet first
    async sign(signOptions) {
        //handle sign transaction based on provider type
        let { provider } = signOptions;
        switch (provider) {
            case 'lynx':
                return await this.signWithTransitProvider(signOptions)
                break;
            case 'ledger':
                return await this.signWithTransitProvider(signOptions)
                break;
            case 'meetone':
                return await this.signWithTransitProvider(signOptions)
                break;
            case 'metro':
                break;
            case 'scatter':
                return await this.signWithTransitProvider(signOptions)
                break;
            case 'tokenpocket':
                return await this.signWithTransitProvider(signOptions)
                break;
            default:
                //assume ORE ID if not one of the others
                return this.signWithOreId(signOptions);
                break;
        }
    }

    //connect to wallet to discover keys
    //any new keys discovered in wallet are added to user and ORE ID record
    async discover(provider, chainNetwork = 'eos_main') {
        switch (provider) {
            case 'lynx':
                await this.connectToTransitProvider(provider, chainNetwork)
            break;
            case 'ledger':
                await this.connectToTransitProvider(provider, chainNetwork)
                break;
            case 'meetone':
                await this.connectToTransitProvider(provider, chainNetwork)
            break;
            case 'metro':
                break;
            case 'scatter':
                await this.connectToTransitProvider(provider, chainNetwork)
                break;
            case 'tokenpocket':
                await this.connectToTransitProvider(provider, chainNetwork)
            break;
            default:
                break;
        }
    }

    async loginWithOreId(provider, state) {
        let { authCallbackUrl, backgroundColor } = this.options;
        let authOptions = {
            provider,
            backgroundColor,
            callbackUrl:authCallbackUrl,
            state
        };
        let loginUrl = await this.getOreIdAuthUrl(authOptions);
        return {loginUrl, errors:null};
    }

    async signWithOreId(signOptions) {
        let { signCallbackUrl } = this.options;
        signOptions['callbackUrl'] = signCallbackUrl;
        let signUrl = await this.getOreIdSignUrl(signOptions);
        return {signUrl, errors:null};
    }

    async signWithTransitProvider(signOptions) {
        let { broadcast, chainNetwork, transaction , provider} = signOptions;
        //connect to wallet
        let response = await this.connectToTransitProvider(provider, chainNetwork);
        let {wallet, isLoggedIn} = response;

        if(!isLoggedIn || !wallet) {
            throw(new Error(`Couldn't connect to ${provider}`));
        }

        //sign with transit wallet
        response = await wallet.eosApi.transact({
            actions: [transaction]
          }, {
            broadcast: broadcast,
            blocksBehind: 3,
            expireSeconds: 60
          }
        )
        return {signedTransaction:response};
    }


    async connectToTransitProvider(provider, chainNetwork) {
        let response;
        let providerId = providerNameMap[provider];
        const chainContext = this.getOrCreateChainContext(chainNetwork);
        const transitProvider = chainContext.getWalletProviders().find(wp => wp.id === providerId);
        const transitWallet = chainContext.initWallet(transitProvider);
        
        try { 
            transitWallet.connect(); 
        } catch(error) { 
            console.log(`Failed to connect to ${provider} wallet:`, error) 
        };

        //try to connect to wallet
        while(transitWallet.inProgress === true) { 
            //todo: add timeout
            await sleep(250);
            console.log(`connecting to ${provider} via eos-transit wallet in progress:`, transitWallet.inProgress)
        };

        //return login results or throw error
        if (transitWallet.connected === true) {
            const {account_name, permissions} = await transitWallet.login();
            if (transitWallet.authenticated) {
                response = {
                    wallet: transitWallet,
                    isLoggedIn: true,
                    account: account_name,
                    permissions,
                    provider
                };
            }
            //add accounts to ORE ID - if ORE ID user account is known
            let userOreAccount = (this.user || {}).accountName;
            if(userOreAccount) {
                let {account:chainAccount, permissions} = response;
                await this.addWalletPermissionstoOreIdAccount(chainAccount, chainNetwork, permissions, userOreAccount, provider);
            }
            return response;
        } else {
            const {hasError, errorMessage} = transitWallet;
            throw(new Error(`${provider} not connected!` + (hasError) ? ` Error: ${errorMessage}` : ``));
        }
    }

    //for each permission in the wallet, add to ORE ID (if not in user's record)
    async addWalletPermissionstoOreIdAccount(chainAccount, chainNetwork, walletPermissions, userOreAccount, provider) {
        await walletPermissions.map( async (p) => {
            let permission = p.perm_name;
            let parentPermission = p.parent;
            //filter out permission that the user already has in his record
            let skipThisPermission = this.user.permissions.some(up => (up.chainNetwork === chainNetwork && up.permission === permission) || permission === 'owner');
            //don't add 'owner' permission and skip ones that are already stored in user's account
            if(skipThisPermission !== true) {
                let publicKey = p.required_auth.keys[0].key; //TODO: Handle multiple keys and weights
                await this.addPermission(userOreAccount, chainAccount, chainNetwork, publicKey, parentPermission, permission, provider);
            };
        });
        //reload user to get updated permissions
        await this.getUserInfoFromApi(userOreAccount);
    }

    // --------------->

    /*
        Validates startup options
    */
    validateOptions(options) {
        let { appId, apiKey, oreIdUrl } = options;
        let errorMessage = ''

        if (!appId) {
            errorMessage += `\n --> Missing required parameter - appId. You can get an appId when you register your app with ORE ID.`
        }
        if (!apiKey) {
            errorMessage += `\n --> Missing required parameter - apiKey. You can get an apiKey when you register your app with ORE ID.`
        }
        if (!oreIdUrl) {
            errorMessage += `\n --> Missing required parameter - oreIdUrl. Refer to the docs to get this value.`
        }
        if (errorMessage != '') {
            throw new Error(`Options are missing or invalid. ${errorMessage}`)
        }

        this.options = options;
    };

    /*
        load user from local storage and call api to get latest info
    */
    async getUser(account) {
        if (account) {
            const user = await this.getUserInfoFromApi(account); //get the latest user data
            return user;
        }
        // Check in state
        if(this.user) {
            return this.user;
        }
        // Check local storage
        let result = this.loadUserLocally();
        return result;
    }

    /*
        Loads settings value from the server 
        e.g. configType='chains' returns valid chain types and addresses
    */
    async getConfig(configType) {
        return await this.getConfigFromApi(configType); 
    }

    /*
        Checks for the expiration of the locally cached app-access-token
        Refreshes token if needed using getNewAppAccessTokenFromApi()
    */
    async getAccessToken() {
        //check for expiration and renew token if expired
        if(!this.appAccessToken || tokenHasExpired(this.appAccessToken)) {
            await this.getNewAppAccessToken(); //call api
        }
        return this.appAccessToken;
    };

    /*
        Returns a fully formed url to call the auth endpoint
    */
    async getOreIdAuthUrl(authOptions) {
        let { provider, callbackUrl, backgroundColor, state } = authOptions;
        let { oreIdUrl } = this.options;

        if(!provider || !callbackUrl) {
            throw new Error(`Missing a required parameter`);
        }

        let appAccessToken = await this.getAccessToken();
        let encodedStateParam = (state) ? `&state=${Base64.encode(JSON.stringify(state))}` : "";

        return `${oreIdUrl}/auth#app_access_token=${appAccessToken}?provider=${provider}?callback_url=${encodeURIComponent(callbackUrl)}?background_color=${backgroundColor}${encodedStateParam}`;
    };

    /*
        Returns a fully formed url to call the sign endpoint
        chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_kylin", 'ore_main', 'eos_test', etc. 
    */
    async getOreIdSignUrl(signOptions) {
        let { account, broadcast, callbackUrl, chainAccount, chainNetwork, state, transaction, accountIsTransactionPermission } = signOptions;
        let { oreIdUrl } = this.options;

        if(!account || !callbackUrl || !transaction) {
            throw new Error(`Missing a required parameter`);
        }

        //default chainAccount is the same as the user's account
        if(!chainAccount) {
            chainAccount = account;
        }

        let appAccessToken = await this.getAccessToken();
        let encodedTransaction = Base64.encode(JSON.stringify(transaction));
        let optionalParams = (state) ? `&state=${Base64.encode(JSON.stringify(state))}` : "";
        optionalParams += (accountIsTransactionPermission) ? `&account_is_transaction_permission=${accountIsTransactionPermission}` : "";

        return `${oreIdUrl}/sign#app_access_token=${appAccessToken}&account=${account}&broadcast=${broadcast}&callback_url=${encodeURIComponent(callbackUrl)}&chain_account=${chainAccount}&chain_network=${chainNetwork}&transaction=${encodedTransaction}${optionalParams}`;
    };

    /*
        Extracts the response parameters on the /auth callback URL string
    */
    handleAuthResponse(callbackUrlString) {
        //Parses error codes and returns an errors array
        //(if there is an error_code param sent back - can have more than one error code - seperated by a ‘&’ delimeter
        let params = urlParamsToArray(callbackUrlString);
        let state;
        let { account, state } = params;
        let errors = this.getErrorCodesFromParams(params);
        return {account, state, errors};
    };

    /*
        Extracts the response parameters on the /sign callback URL string
    */
    handleSignResponse(callbackUrlString) {
        let signedTransaction;
        let state;
        let params = urlParamsToArray(callbackUrlString);
        let {signed_transaction:encodedTransaction, state} = params;
        let errors = this.getErrorCodesFromParams(params);

        if(!errors) {
            //Decode base64 parameters
            signedTransaction = tryParseJSON(base64DecodeSafe(encodedTransaction));
        }
        return {signedTransaction, state, errors};
    };

    /*
        Calls the {oreIDUrl}/api/app-token endpoint to get the appAccessToken
    */
    async getNewAppAccessToken() {
        let responseJson = await this.callOreIdApi(`app-token`)
        let { appAccessToken } = responseJson;
        this.appAccessToken = appAccessToken;
        let decodedToken = jwtDecodeSafe(appAccessToken);
        // this.appId = decodedToken[APPID_CLAIM_URI]; //Get the appId from the app token
    };

    /*
        Get the user info from ORE ID for the given user account
    */
    async getUserInfoFromApi(account) {
        let responseJson = await this.callOreIdApi(`account/user?account=${account}`)
        let userInfo = responseJson;
        this.saveUserLocally(userInfo);
        await this.loadUserLocally(); //ensures this.user state is set
        return userInfo;
    };

    /*
        Get the config (setting) values of a specific type
    */
    async getConfigFromApi(configType) {
        if(!configType) {
            throw new Error(`Missing a required parameter: configType`);
        }
        let responseJson = await this.callOreIdApi(`services/config?type=${configType}`)
        let results = responseJson;
        let { values } = results || {};
        if(!values) {
            throw new Error(`Not able to retrieve config values for ${configType}`);
        }
        return values;
    };

    /*
        Adds a public key to an account with a specific permission name 
        The permission name must be one defined in the App Registration record (Which defines its parent permission as well as preventing adding rougue permissions)
        This feature allows your app to hold private keys locally (for certain actions enabled by the permission) while having the associated public key in the user's account
        chainAccount = name of the account on the chain - 12/13-digit string on EOS and Ethereum Address on ETH - it may be the same as the account
        chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_kylin", 'ore_main', 'eos_test', etc. 
    */
   async addPermission(account, chainAccount, chainNetwork, publicKey, parentPermission, permission, provider) {
        let optionalParams = (provider) ? `&wallet-type=${provider}` : '';
        optionalParams += (parentPermission) ? `&parent-permission=${parentPermission}` : '';
        let responseJson = await this.callOreIdApi(`account/add-permission?account=${account}&chain-account=${chainAccount}&chain-network=${chainNetwork}&permission=${permission}&public-key=${publicKey}${optionalParams}`)
        //if failed, error will be thrown
    };

    /*
        Get the user info from ORE ID for the given user account
    */
    async getUserWalletInfo(account) {
        throw Error('Not Implemented');
        // let responseJson = await this.callOreIdApi(`wallet?account=${account}`)
        // let userWalletInfo = responseJson;
        // return {userWalletInfo, errors};
    };

    /*
        Helper function to call api endpoint and inject api-key
    */
    async callOreIdApi(endpointAndParams) {
        let { apiKey, oreIdUrl } = this.options;
        let url = `${oreIdUrl}/api/${endpointAndParams}`;
        let response = await fetch(url, {
            headers: { 'api-key' : apiKey }}
        );

        let responseJson = await response.json();
        let { error, message } = responseJson;
        if (error) {
            throw new Error(error);
        };
        return responseJson;
    }

    /*
        Params is a javascript object representing the parameters parsed from an URL string
    */
    getErrorCodesFromParams(params) {
        let errorCodes;
        let errorString = params["error_code"];
        let errorMessage = params["error_message"];
        if(errorString) {
            errorCodes = errorString.split(/[/?/$&]/);
        }
        if(errorCodes || errorMessage) {
            errorCodes = errorCodes || [];
            errorCodes.push(errorMessage);
        };
        return errorCodes;
    };

    /*
        We don't really maintain a logged-in state 
        However, we do have local cached user data, so clear that
    */
    logout() {
        //clear local state
        this.clearLocalState();
    }

    /*
        Local state
    */

    userKey() {
        return `oreid.${this.options.appId}.user`;
    }

    saveUserLocally(user) {
        if(isNullOrEmpty(user)) { return; }
        this.user = user;
        let serialized = JSON.stringify(this.user);
        this.storage.setItem(this.userKey(), serialized);
    }

    loadUserLocally() {
        let serialized = this.storage.getItem(this.userKey());
        //user state does not exist
        if(isNullOrEmpty(serialized)) {
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

module.exports = {
    OreId
}
