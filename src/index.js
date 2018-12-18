const { log, tokenHasExpired } = require("./helpers.js");
const Base64 = require('js-base64').Base64;
const fetch = require('node-fetch');

class OreId {

    constructor(options) {
        this.options;
        this.appAccessToken;
        this.validateOptions(options);
        // await this.getAccessToken();
    }

    /*
        Validate startup options
    */
   validateOptions(options) {
        let { apiKey, oreIdUrl } = options;
        let errorMessage = ''

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
        Checks for the expiration of the locally stored app-access-token 
        Refreshes token if needed using getNewAppAccessToken()
    */
    async getAccessToken() {
        //check for expiration and renew token if expired
        if(!this.appAccessToken || tokenHasExpired(this.appAccessToken)) {
            await this.getNewAppAccessToken();
        }
        return this.appAccessToken;
    };

    /* 
        Returns a fully formed url to call the auth endpoint
    */
    async getOreIdAuthUrl(authOptions) {
        let { loginType, callbackUrl, backgroundColor } = authOptions;
        let { oreIdUrl } = this.options;

        if(!loginType || !callbackUrl) {
            throw new Error(`Missing a required parameter`);
        }

        let appAccessToken = await this.getAccessToken();
        return `${oreIdUrl}/auth#app_access_token=${appAccessToken}?provider=${loginType}?callback_url=${encodeURIComponent(callbackUrl)}?background_color=${backgroundColor}`;
    };

    /* 
        Returns a fully formed url to call the sign endpoint
    */
    async getOreIdSignUrl(signOptions) {
        let { account, callbackUrl, transaction, chain, broadcast } = signOptions;
        let { oreIdUrl} = this.options;
        
        if(!transaction || !account || !callbackUrl || !chain) {
            throw new Error(`Missing a required parameter`);
        }

        let appAccessToken = await this.getAccessToken();
        const encodedTransaction = Base64.encode(JSON.stringify(transaction));

        return `${oreIdUrl}/sign#app_access_token=${appAccessToken}&account=${account}&callback_url=${encodeURIComponent(callbackUrl)}&chain=${chain}&broadcast=${broadcast}&transaction=${encodedTransaction}`;
    };

    /*
        Extracts the response parameters on the /auth callback URL string
    */
    handleAuthResponse(callbackUrlString) {
        //Parses error codes and returns an errors array 
        //(if there is an error_code param sent back - can have more than one error code - seperated by a ‘&’ delimeter
        params = urlParamsToArray(callbackUrlString);
        let { account } = params;
        let errors = getErrorCodesFromParams(params);
        return {account, errors};
    };

    /*
        Extracts the response parameters on the /sign callback URL string
    */
    handleSignResponse(callbackUrlString) {
        params = urlParamsToArray(callbackUrlString);
        let { signed_transaction:signedTransaction, state } = params;
        let errors = getErrorCodesFromParams(params);
        if(!errors) {
            //Decode base64 parameters
            const signedTransaction =  tryParseJSON(Base64.decode(signedTransaction));
            const state =  tryParseJSON(Base64.decode(encodedState));
        }
        return {signedTransaction, state, errors};
    };

    /*  
        Calls the {oreIDUrl}/api/app-token endpoint to get the appAccessToken 
    */
   async getNewAppAccessToken() {
        let { apiKey, oreIdUrl } = this.options;
        let response = await fetch(`${oreIdUrl}/api/app-token`, {
            headers: { 'api-key' : apiKey }}
        );
        let responseJson = await response.json();
        const { error, message } = responseJson;
        if (error) {
            throw new Error(error);
        };

        let { appAccessToken } = responseJson;
        this.appAccessToken = appAccessToken;
    };

    /*
        Get the user info from ORE ID for the given user account
    */
   async getUserInfo(account) {
        let { apiKey, oreIdUrl } = this.options;
        let url =`${oreIdUrl}/api/user?account=${account}`;

        let response = await fetch(url, {
            headers: { 'api-key' : apiKey }}
        );

        let responseJson = await response.json();
        const { error, message } = responseJson;
        if (error) {
            throw new Error(error);
        };

        let userInfo = responseJson;

        return {userInfo};
    };

   /*
        Get the user info from ORE ID for the given user account
   */
   async getUserWalletInfo(account) {
        let { apiKey, oreIdUrl } = this.options;
        let url =`${oreIdUrl}/api/wallet?account=${account}`;

        let response = await fetch(url, {
            headers: { 'api-key' : apiKey }}
        );

        let responseJson = await response.json();
        const { error, message } = responseJson;
        if (error) {
            throw new Error(error);
        };

        let userWalletInfo = responseJson;

        return {userWalletInfo, errors};
    };

    /*
        params is a javascript object representing the parameters parsed from an URL string
    */
    getErrorCodesFromParams(params) {
        let errorCodes;
        let errorString = params[error-code];
        if(errorString) {
            errorCodes = errorString.split(/[/?/$&]/);
        }
        return errorCodes;
    };

}

module.exports = {
    OreId
}
