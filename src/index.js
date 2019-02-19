const { isNullOrEmpty, jwtDecodeSafe, log, tokenHasExpired, tryParseJSON, urlParamsToArray } = require("./helpers.js");
// const StorageHandler = require("./storage.js");
const Base64 = require('js-base64').Base64;
const fetch = require('node-fetch');
import StorageHandler from './storage';

const APPID_CLAIM_URI = "https://oreid.aikon.com/appId";

class OreId {

    constructor(options) {
        this.options;
        this.appAccessToken;
        this.user;
        this.storage = new StorageHandler();
        this.validateOptions(options);
    }

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
        let { loginType, callbackUrl, backgroundColor, state } = authOptions;
        let { oreIdUrl } = this.options;

        if(!loginType || !callbackUrl) {
            throw new Error(`Missing a required parameter`);
        }

        let appAccessToken = await this.getAccessToken();
        let encodedStateParam = (state) ? `&state=${Base64.encode(JSON.stringify(state))}` : "";

        return `${oreIdUrl}/auth#app_access_token=${appAccessToken}?provider=${loginType}?callback_url=${encodeURIComponent(callbackUrl)}?background_color=${backgroundColor}${encodedStateParam}`;
    };

    /*
        Returns a fully formed url to call the sign endpoint
    */
    async getOreIdSignUrl(signOptions) {
        let { account, broadcast, callbackUrl, chain, state, transaction } = signOptions;
        let { oreIdUrl } = this.options;

        if(!transaction || !account || !callbackUrl || !chain) {
            throw new Error(`Missing a required parameter`);
        }

        let appAccessToken = await this.getAccessToken();
        let encodedTransaction = Base64.encode(JSON.stringify(transaction));
        let encodedStateParam = (state) ? `&state=${Base64.encode(JSON.stringify(state))}` : "";

        return `${oreIdUrl}/sign#app_access_token=${appAccessToken}&account=${account}&callback_url=${encodeURIComponent(callbackUrl)}&chain=${chain}&broadcast=${broadcast}&transaction=${encodedTransaction}${encodedStateParam}`;
    };

    /*
        Extracts the response parameters on the /auth callback URL string
    */
    handleAuthResponse(callbackUrlString) {
        //Parses error codes and returns an errors array
        //(if there is an error_code param sent back - can have more than one error code - seperated by a ‘&’ delimeter
        let params = urlParamsToArray(callbackUrlString);
        let state;
        let { account, state:encodedState } = params;
        let errors = this.getErrorCodesFromParams(params);

        if(encodedState) {
            //Decode base64 parameters
            state = JSON.parse(Base64.decode(encodedState));
        }
        return {account, state, errors};
    };

    /*
        Extracts the response parameters on the /sign callback URL string
    */
    handleSignResponse(callbackUrlString) {
        let signedTransaction;
        let state;
        let params = urlParamsToArray(callbackUrlString);
        let {signed_transaction:encodedTransaction, state:encodedState} = params;
        let errors = this.getErrorCodesFromParams(params);

        if(!errors) {
            //Decode base64 parameters
            signedTransaction = tryParseJSON(Base64.decode(encodedTransaction));
            state = JSON.parse(Base64.decode(encodedState));
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
        Adds a public key to an account with a specific permission name 
        The permission name must be one defined in the App Registration record (Which defines its parent permission as well as preventing adding rougue permissions)
        This feature allows your app to hold private keys locally (for certain actions enabled by the permission) while having the associated public key in the user's account
        chainAccount is the name of the account on the chain - 12/13-digit string on EOS and Ethereum Address on ETH
    */
   async addPermission(account, chain, chainAccount, publicKey, permission) {
        let responseJson = await this.callOreIdApi(`account/add-permission?account=${account}&chain=${chain}&chain-account=${chainAccount}&public-key=${publicKey}&permission=${permission}`)
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
