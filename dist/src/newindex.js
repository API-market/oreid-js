

const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(((resolve, reject) => {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : new P(((resolve) => { resolve(result.value); })).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  }));
};
const __generator = (this && this.__generator) || function (thisArg, body) {
  let _ = { label: 0, sent() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }; let f; let y; let t; let
    g;
  return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === 'function' && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError('Generator is already executing.');
    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0: case 1: t = op; break;
          case 4: _.label++; return { value: op[1], done: false };
          case 5: _.label++; y = op[1]; op = [0]; continue;
          case 7: op = _.ops.pop(); _.trys.pop(); continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
            if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
            if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
            if (t[2]) _.ops.pop();
            _.trys.pop(); continue;
        }
        op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, '__esModule', { value: true });

const { isNullOrEmpty } = _a; const { jwtDecodeSafe } = _a; const { log } = _a; const { tokenHasExpired } = _a; const { tryParseJSON } = _a; const
  { urlParamsToArray } = _a;
// const StorageHandler = require("./storage.js");
const { Base64 } = require('js-base64');
const fetch = require('node-fetch');
const _a = require('./helpers.js');
const storage_1 = require('./storage');

const APPID_CLAIM_URI = 'https://oreid.aikon.com/appId';
const OreId = /** @class */ (function () {
  function OreId(options) {
    this.options;
    this.appAccessToken;
    this.user;
    this.storage = new storage_1.default();
    this.validateOptions(options);
  }
  /*
        Validates startup options
    */
  OreId.prototype.validateOptions = function (options) {
    const { appId } = options;
    const { apiKey } = options;
    const { oreIdUrl } = options;
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
    if (errorMessage != '') {
      throw new Error(`Options are missing or invalid. ${errorMessage}`);
    }
    this.options = options;
  };

  /*
        load user from local storage and call api to get latest info
    */
  OreId.prototype.getUser = function (account) {
    return __awaiter(this, void 0, void 0, function () {
      let user; let
        result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            console.log('--->getUser::account', account, this);
            if (!account) return [3 /* break */, 2];
            return [4 /* yield */, this.getUserInfoFromApi(account)];
          case 1:
            user = _a.sent();
            console.log('oreid-js::getUser::user:', this, user);
            return [2 /* return */, user];
          case 2:
            // Check in state
            if (this.user) {
              return [2 /* return */, this.user];
            }
            result = this.loadUserLocally() || {};
            return [2 /* return */, result.account];
        }
      });
    });
  };
  /*
        Checks for the expiration of the locally cached app-access-token
        Refreshes token if needed using getNewAppAccessTokenFromApi()
    */
  OreId.prototype.getAccessToken = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(!this.appAccessToken || tokenHasExpired(this.appAccessToken))) return [3 /* break */, 2];
            return [4 /* yield */, this.getNewAppAccessToken()];
          case 1:
            _a.sent(); // call api
            _a.label = 2;
          case 2: return [2 /* return */, this.appAccessToken];
        }
      });
    });
  };

  /*
        Returns a fully formed url to call the auth endpoint
    */
  OreId.prototype.getOreIdAuthUrl = function (authOptions) {
    return __awaiter(this, void 0, void 0, function () {
      let loginType; let callbackUrl; let backgroundColor; let state; let oreIdUrl; let appAccessToken; let
        encodedStateParam;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            loginType = authOptions.loginType, callbackUrl = authOptions.callbackUrl, backgroundColor = authOptions.backgroundColor, state = authOptions.state;
            oreIdUrl = this.options.oreIdUrl;
            if (!loginType || !callbackUrl) {
              throw new Error('Missing a required parameter');
            }
            return [4 /* yield */, this.getAccessToken()];
          case 1:
            appAccessToken = _a.sent();
            encodedStateParam = (state) ? `&state=${Base64.encode(JSON.stringify(state))}` : '';
            return [2 /* return */, `${oreIdUrl}/auth#app_access_token=${appAccessToken}?provider=${loginType}?callback_url=${encodeURIComponent(callbackUrl)}?background_color=${backgroundColor}${encodedStateParam}`];
        }
      });
    });
  };

  /*
        Returns a fully formed url to call the sign endpoint
    */
  OreId.prototype.getOreIdSignUrl = function (signOptions) {
    return __awaiter(this, void 0, void 0, function () {
      let account; let broadcast; let callbackUrl; let chain; let state; let transaction; let oreIdUrl; let appAccessToken; let encodedTransaction; let
        encodedStateParam;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            account = signOptions.account, broadcast = signOptions.broadcast, callbackUrl = signOptions.callbackUrl, chain = signOptions.chain, state = signOptions.state, transaction = signOptions.transaction;
            oreIdUrl = this.options.oreIdUrl;
            if (!transaction || !account || !callbackUrl || !chain) {
              throw new Error('Missing a required parameter');
            }
            return [4 /* yield */, this.getAccessToken()];
          case 1:
            appAccessToken = _a.sent();
            encodedTransaction = Base64.encode(JSON.stringify(transaction));
            encodedStateParam = (state) ? `&state=${Base64.encode(JSON.stringify(state))}` : '';
            return [2 /* return */, `${oreIdUrl}/sign#app_access_token=${appAccessToken}&account=${account}&callback_url=${encodeURIComponent(callbackUrl)}&chain=${chain}&broadcast=${broadcast}&transaction=${encodedTransaction}${encodedStateParam}`];
        }
      });
    });
  };

  /*
        Extracts the response parameters on the /auth callback URL string
    */
  OreId.prototype.handleAuthResponse = function (callbackUrlString) {
    // Parses error codes and returns an errors array
    // (if there is an error_code param sent back - can have more than one error code - seperated by a ‘&’ delimeter
    const params = urlParamsToArray(callbackUrlString);
    let state;
    const { account } = params;
    const encodedState = params.state;
    const errors = this.getErrorCodesFromParams(params);
    if (!errors && encodedState) {
      // Decode base64 parameters
      state = JSON.parse(Base64.decode(encodedState));
    }
    return { account, state, errors };
  };

  /*
        Extracts the response parameters on the /sign callback URL string
    */
  OreId.prototype.handleSignResponse = function (callbackUrlString) {
    let signedTransaction;
    let state;
    const params = urlParamsToArray(callbackUrlString);
    const encodedTransaction = params.signed_transaction; const
      encodedState = params.state;
    const errors = this.getErrorCodesFromParams(params);
    if (!errors) {
      // Decode base64 parameters
      signedTransaction = tryParseJSON(Base64.decode(encodedTransaction));
      state = JSON.parse(Base64.decode(encodedState));
    }
    return { signedTransaction, state, errors };
  };

  /*
        Calls the {oreIDUrl}/api/app-token endpoint to get the appAccessToken
    */
  OreId.prototype.getNewAppAccessToken = function () {
    return __awaiter(this, void 0, void 0, function () {
      let responseJson; let appAccessToken; let
        decodedToken;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4 /* yield */, this.callOreIdApi('app-token')];
          case 1:
            responseJson = _a.sent();
            appAccessToken = responseJson.appAccessToken;
            this.appAccessToken = appAccessToken;
            decodedToken = jwtDecodeSafe(appAccessToken);
            return [2];
        }
      });
    });
  };

  /*
        Get the user info from ORE ID for the given user account
    */
  OreId.prototype.getUserInfoFromApi = function (account) {
    return __awaiter(this, void 0, void 0, function () {
      let responseJson; let userInfo; let
        userInfoOut;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4 /* yield */, this.callOreIdApi(`account/user?account=${account}`)];
          case 1:
            responseJson = _a.sent();
            userInfo = responseJson;
            this.saveUserLocally(userInfo);
            userInfoOut = this.loadUserLocally();
            return [2 /* return */, userInfo];
        }
      });
    });
  };

  /*
        Adds a public key to an account with a specific permission name
        The permission name must be one defined in the App Registration record (Which defines its parent permission as well as preventing adding rougue permissions)
        This feature allows your app to hold private keys locally (for certain actions enabled by the permission) while having the associated public key in the user's account
    */
  OreId.prototype.addPermission = function (account, publicKey, permission) {
    return __awaiter(this, void 0, void 0, function () {
      let responseJson;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4 /* yield */, this.callOreIdApi(`account/add-permission?account=${account}&public-key=${publicKey}&permission=${permission}`),
            // if failed, error will be thrown
          ];
          case 1:
            responseJson = _a.sent();
            return [2];
        }
      });
    });
  };

  /*
        Get the user info from ORE ID for the given user account
    */
  OreId.prototype.getUserWalletInfo = function (account) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, (_a) => {
        throw Error('Not Implemented');
      });
    });
  };

  /*
        Helper function to call api endpoint and inject api-key
    */
  OreId.prototype.callOreIdApi = function (endpointAndParams) {
    return __awaiter(this, void 0, void 0, function () {
      let _a; let apiKey; let oreIdUrl; let url; let response; let responseJson; let error; let
        message;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _a = this.options, apiKey = _a.apiKey, oreIdUrl = _a.oreIdUrl;
            url = `${oreIdUrl}/api/${endpointAndParams}`;
            return [4 /* yield */, fetch(url, {
              headers: { 'api-key': apiKey },
            })];
          case 1:
            response = _b.sent();
            return [4 /* yield */, response.json()];
          case 2:
            responseJson = _b.sent();
            error = responseJson.error, message = responseJson.message;
            if (error) {
              throw new Error(error);
            }

            return [2 /* return */, responseJson];
        }
      });
    });
  };
  /*
        Params is a javascript object representing the parameters parsed from an URL string
    */
  OreId.prototype.getErrorCodesFromParams = function (params) {
    let errorCodes;
    const errorString = params.error_code;
    if (errorString) {
      errorCodes = errorString.split(/[/?/$&]/);
    }
    return errorCodes;
  };

  /*
        Local state
    */
  OreId.prototype.userKey = function () {
    return `oreid.${this.options.appId}.user`;
  };
  OreId.prototype.saveUserLocally = function (user) {
    if (isNullOrEmpty(user)) {
      return;
    }
    this.user = user;
    const serialized = JSON.stringify(this.user);
    this.storage.setItem(this.userKey(), serialized);
  };
  OreId.prototype.loadUserLocally = function () {
    const serialized = this.storage.getItem(this.userKey());
    // user state does not exist
    if (isNullOrEmpty(serialized)) {
      this.user = {};
      return {};
    }
    this.user = JSON.parse(serialized);
    return this.user;
    return {};
  };
  OreId.prototype.clearLocalState = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        this.storage.removeItem(this.userKey());
        return [2];
      });
    });
  };
  return OreId;
}());
module.exports = {
  OreId,
};
// # sourceMappingURL=newindex.js.map
