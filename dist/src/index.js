

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
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
};
Object.defineProperty(exports, '__esModule', { value: true });

const { base64DecodeSafe } = _a; const { isNullOrEmpty } = _a; const { jwtDecodeSafe } = _a; const { log } = _a; const { sleep } = _a; const { tokenHasExpired } = _a; const { tryParseJSON } = _a; const
  { urlParamsToArray } = _a;
// const StorageHandler = require("./storage.js");
const { Base64 } = require('js-base64');
const fetch = require('node-fetch');
const eos_transit_1 = require('eos-transit');
const eos_transit_scatter_provider_1 = __importDefault(require('eos-transit-scatter-provider'));
const eos_transit_ledger_provider_1 = __importDefault(require('eos-transit-ledger-provider'));
const eos_transit_lynx_provider_1 = __importDefault(require('eos-transit-lynx-provider'));
const eos_transit_meetone_provider_1 = __importDefault(require('eos-transit-meetone-provider'));
const eos_transit_tokenpocket_provider_1 = __importDefault(require('eos-transit-tokenpocket-provider'));
const storage_1 = __importDefault(require('./storage'));
const _a = require('./helpers.js');

const APPID_CLAIM_URI = 'https://oreid.aikon.com/appId';
const providerNameMap = {
  ledger: 'ledger',
  lynx: 'EOS Lynx',
  meetone: 'meetone_provider',
  metro: 'metro',
  scatter: 'scatter',
  tokenpocket: 'TokenPocket',
};
const OreId = /** @class */ (function () {
  function OreId(options) {
    this.options;
    this.appAccessToken;
    this.user;
    this.storage = new storage_1.default();
    this.validateOptions(options);
    this.chainContexts = {};
    this.chainNetworks = [];
    this.init(); // todo: handle multiple networks
  }
  // Initialize the library
  OreId.prototype.init = function () {
    return __awaiter(this, void 0, void 0, function () {
      let results;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4 /* yield */, this.getConfigFromApi('chains')];
          case 1:
            results = _a.sent();
            this.chainNetworks = results.chains;
            return [2];
        }
      });
    });
  };
  OreId.prototype.getOrCreateChainContext = function (chainNetwork) {
    const { appName } = this.options;
    if (this.chainContexts[chainNetwork]) {
      return this.chainContexts[chainNetwork];
    }
    const chainConfig = this.chainNetworks.find((n) => n.network === chainNetwork);
    if (!chainConfig) {
      throw new Error(`Invalid chain network: ${chainNetwork}.`);
    }
    const { hosts } = chainConfig;
    const _a = hosts[0]; const { chainId } = _a; const { host } = _a; const { port } = _a; const
      { protocol } = _a; // using first host
    const NETWORK_CONFIG = { host, port, protocol, chainId };
    // create context
    const chainContext = eos_transit_1.initAccessContext({
      appName: appName || 'missing appName',
      network: NETWORK_CONFIG,
      walletProviders: [
        eos_transit_scatter_provider_1.default(),
        eos_transit_ledger_provider_1.default({ pathIndexList: [0, 1, 2, 35] }),
        eos_transit_lynx_provider_1.default(),
        eos_transit_meetone_provider_1.default(),
        eos_transit_tokenpocket_provider_1.default(),
      ],
    });
    // cache for future use
    this.chainContexts[chainNetwork] = chainContext;
    return chainContext;
  };
  OreId.prototype.login = function (loginOptions, chainNetwork) {
    if (chainNetwork === void 0) { chainNetwork = 'eos_main'; }
    return __awaiter(this, void 0, void 0, function () {
      let provider;
      return __generator(this, function (_a) {
        provider = loginOptions.provider;
        // handle log-in based on type
        switch (provider) {
          case 'ledger':
            return [2 /* return */, this.connectToTransitProvider(provider, chainNetwork)];
            break;
          case 'lynx':
            return [2 /* return */, this.connectToTransitProvider(provider, chainNetwork)];
            break;
          case 'meetone':
            return [2 /* return */, this.connectToTransitProvider(provider, chainNetwork)];
            break;
          case 'metro':
            throw new Error('Not Implemented');
            // return this.connectToTransitProvider(provider, chainNetwork);
            break;
          case 'scatter':
            return [2 /* return */, this.connectToTransitProvider(provider, chainNetwork)];
            break;
          case 'tokenpocket':
            return [2 /* return */, this.connectToTransitProvider(provider, chainNetwork)];
            break;
          default:
            // assume ORE ID if not one of the others
            return [2 /* return */, this.loginWithOreId(provider)];
            break;
        }
        return [2];
      });
    });
  };
  // sign transaction with keys in wallet - connect to wallet first
  OreId.prototype.sign = function (signOptions) {
    return __awaiter(this, void 0, void 0, function () {
      let provider; let
        _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            provider = signOptions.provider;
            _a = provider;
            switch (_a) {
              case 'lynx': return [3 /* break */, 1];
              case 'ledger': return [3 /* break */, 3];
              case 'meetone': return [3 /* break */, 5];
              case 'metro': return [3 /* break */, 7];
              case 'scatter': return [3 /* break */, 8];
              case 'tokenpocket': return [3 /* break */, 10];
            }
            return [3 /* break */, 12];
          case 1: return [4 /* yield */, this.signWithTransitProvider(signOptions)];
          case 2: return [2 /* return */, _b.sent()];
          case 3: return [4 /* yield */, this.signWithTransitProvider(signOptions)];
          case 4: return [2 /* return */, _b.sent()];
          case 5: return [4 /* yield */, this.signWithTransitProvider(signOptions)];
          case 6: return [2 /* return */, _b.sent()];
          case 7: return [3 /* break */, 13];
          case 8: return [4 /* yield */, this.signWithTransitProvider(signOptions)];
          case 9: return [2 /* return */, _b.sent()];
          case 10: return [4 /* yield */, this.signWithTransitProvider(signOptions)];
          case 11: return [2 /* return */, _b.sent()];
          case 12:
            // assume ORE ID if not one of the others
            return [2 /* return */, this.signWithOreId(signOptions)];
          case 13: return [2];
        }
      });
    });
  };
  // connect to wallet to discover keys
  // any new keys discovered in wallet are added to user and ORE ID record
  OreId.prototype.discover = function (provider, chainNetwork) {
    if (chainNetwork === void 0) { chainNetwork = 'eos_main'; }
    return __awaiter(this, void 0, void 0, function () {
      let _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _a = provider;
            switch (_a) {
              case 'lynx': return [3 /* break */, 1];
              case 'ledger': return [3 /* break */, 3];
              case 'meetone': return [3 /* break */, 5];
              case 'metro': return [3 /* break */, 7];
              case 'scatter': return [3 /* break */, 8];
              case 'tokenpocket': return [3 /* break */, 10];
            }
            return [3 /* break */, 12];
          case 1: return [4 /* yield */, this.connectToTransitProvider(provider, chainNetwork)];
          case 2:
            _b.sent();
            return [3 /* break */, 13];
          case 3: return [4 /* yield */, this.connectToTransitProvider(provider, chainNetwork)];
          case 4:
            _b.sent();
            return [3 /* break */, 13];
          case 5: return [4 /* yield */, this.connectToTransitProvider(provider, chainNetwork)];
          case 6:
            _b.sent();
            return [3 /* break */, 13];
          case 7: return [3 /* break */, 13];
          case 8: return [4 /* yield */, this.connectToTransitProvider(provider, chainNetwork)];
          case 9:
            _b.sent();
            return [3 /* break */, 13];
          case 10: return [4 /* yield */, this.connectToTransitProvider(provider, chainNetwork)];
          case 11:
            _b.sent();
            return [3 /* break */, 13];
          case 12: return [3 /* break */, 13];
          case 13: return [2];
        }
      });
    });
  };
  OreId.prototype.loginWithOreId = function (provider, state) {
    return __awaiter(this, void 0, void 0, function () {
      let _a; let authCallbackUrl; let backgroundColor; let authOptions; let
        loginUrl;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _a = this.options, authCallbackUrl = _a.authCallbackUrl, backgroundColor = _a.backgroundColor;
            authOptions = {
              provider,
              backgroundColor,
              callbackUrl: authCallbackUrl,
              state,
            };
            return [4 /* yield */, this.getOreIdAuthUrl(authOptions)];
          case 1:
            loginUrl = _b.sent();
            return [2 /* return */, { loginUrl, errors: null }];
        }
      });
    });
  };
  OreId.prototype.signWithOreId = function (signOptions) {
    return __awaiter(this, void 0, void 0, function () {
      let signCallbackUrl; let
        signUrl;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            signCallbackUrl = this.options.signCallbackUrl;
            signOptions.callbackUrl = signCallbackUrl;
            return [4 /* yield */, this.getOreIdSignUrl(signOptions)];
          case 1:
            signUrl = _a.sent();
            return [2 /* return */, { signUrl, errors: null }];
        }
      });
    });
  };
  OreId.prototype.signWithTransitProvider = function (signOptions) {
    return __awaiter(this, void 0, void 0, function () {
      let broadcast; let chainNetwork; let transaction; let provider; let response; let wallet; let
        isLoggedIn;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            broadcast = signOptions.broadcast, chainNetwork = signOptions.chainNetwork, transaction = signOptions.transaction, provider = signOptions.provider;
            return [4 /* yield */, this.connectToTransitProvider(provider, chainNetwork)];
          case 1:
            response = _a.sent();
            wallet = response.wallet, isLoggedIn = response.isLoggedIn;
            if (!isLoggedIn || !wallet) {
              throw (new Error(`Couldn't connect to ${provider}`));
            }
            return [4 /* yield */, wallet.eosApi.transact({
              actions: [transaction],
            }, {
              broadcast,
              blocksBehind: 3,
              expireSeconds: 60,
            })];
          case 2:
            // sign with transit wallet
            response = _a.sent();
            return [2 /* return */, { signedTransaction: response }];
        }
      });
    });
  };
  OreId.prototype.connectToTransitProvider = function (provider, chainNetwork) {
    return __awaiter(this, void 0, void 0, function () {
      let response; let providerId; let chainContext; let transitProvider; let transitWallet; let _a; let account_name; let permissions; let userOreAccount; let chainAccount; let permissions_1; let hasError; let
        errorMessage;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            providerId = providerNameMap[provider];
            chainContext = this.getOrCreateChainContext(chainNetwork);
            transitProvider = chainContext.getWalletProviders().find((wp) => wp.id === providerId);
            transitWallet = chainContext.initWallet(transitProvider);
            try {
              transitWallet.connect();
            } catch (error) {
              console.log(`Failed to connect to ${provider} wallet:`, error);
            }

            _b.label = 1;
          case 1:
            if (!(transitWallet.inProgress === true)) return [3 /* break */, 3];
            // todo: add timeout
            return [4 /* yield */, sleep(250)];
          case 2:
            // todo: add timeout
            _b.sent();
            console.log(`connecting to ${provider} via eos-transit wallet in progress:`, transitWallet.inProgress);
            return [3 /* break */, 1];
          case 3:

            if (!(transitWallet.connected === true)) return [3 /* break */, 7];
            return [4 /* yield */, transitWallet.login()];
          case 4:
            _a = _b.sent(), account_name = _a.account_name, permissions = _a.permissions;
            if (transitWallet.authenticated) {
              response = {
                wallet: transitWallet,
                isLoggedIn: true,
                account: account_name,
                permissions,
                provider,
              };
            }
            userOreAccount = (this.user || {}).accountName;
            if (!userOreAccount) return [3 /* break */, 6];
            chainAccount = response.account, permissions_1 = response.permissions;
            return [4 /* yield */, this.addWalletPermissionstoOreIdAccount(chainAccount, chainNetwork, permissions_1, userOreAccount, provider)];
          case 5:
            _b.sent();
            _b.label = 6;
          case 6: return [2 /* return */, response];
          case 7:
            hasError = transitWallet.hasError, errorMessage = transitWallet.errorMessage;
            throw (new Error(`${provider} not connected!${hasError}` ? ` Error: ${errorMessage}` : ''));
        }
      });
    });
  };
  // for each permission in the wallet, add to ORE ID (if not in user's record)
  OreId.prototype.addWalletPermissionstoOreIdAccount = function (chainAccount, chainNetwork, walletPermissions, userOreAccount, provider) {
    return __awaiter(this, void 0, void 0, function () {
      const _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4 /* yield */, walletPermissions.map((p) => __awaiter(_this, void 0, void 0, function () {
            let permission; let parentPermission; let skipThisPermission; let
              publicKey;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  permission = p.perm_name;
                  parentPermission = p.parent;
                  skipThisPermission = this.user.permissions.some((up) => (up.chainNetwork === chainNetwork && up.permission === permission) || permission === 'owner');
                  if (!(skipThisPermission !== true)) return [3 /* break */, 2];
                  publicKey = p.required_auth.keys[0].key;
                  return [4 /* yield */, this.addPermission(userOreAccount, chainAccount, chainNetwork, publicKey, parentPermission, permission, provider)];
                case 1:
                  _a.sent();
                  _a.label = 2;
                case 2:

                  return [2];
              }
            });
          }))];
          case 1:
            _a.sent();
            // reload user to get updated permissions
            return [4 /* yield */, this.getUserInfoFromApi(userOreAccount)];
          case 2:
            // reload user to get updated permissions
            _a.sent();
            return [2];
        }
      });
    });
  };
  // --------------->
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
            if (!account) return [3 /* break */, 2];
            return [4 /* yield */, this.getUserInfoFromApi(account)];
          case 1:
            user = _a.sent();
            return [2 /* return */, user];
          case 2:
            // Check in state
            if (this.user) {
              return [2 /* return */, this.user];
            }
            result = this.loadUserLocally();
            return [2 /* return */, result];
        }
      });
    });
  };
  /*
        Loads settings value from the server
        e.g. configType='chains' returns valid chain types and addresses
    */
  OreId.prototype.getConfig = function (configType) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4 /* yield */, this.getConfigFromApi(configType)];
          case 1: return [2 /* return */, _a.sent()];
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
      let provider; let callbackUrl; let backgroundColor; let state; let oreIdUrl; let appAccessToken; let
        encodedStateParam;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            provider = authOptions.provider, callbackUrl = authOptions.callbackUrl, backgroundColor = authOptions.backgroundColor, state = authOptions.state;
            oreIdUrl = this.options.oreIdUrl;
            if (!provider || !callbackUrl) {
              throw new Error('Missing a required parameter');
            }
            return [4 /* yield */, this.getAccessToken()];
          case 1:
            appAccessToken = _a.sent();
            encodedStateParam = (state) ? `&state=${Base64.encode(JSON.stringify(state))}` : '';
            return [2 /* return */, `${oreIdUrl}/auth#app_access_token=${appAccessToken}?provider=${provider}?callback_url=${encodeURIComponent(callbackUrl)}?background_color=${backgroundColor}${encodedStateParam}`];
        }
      });
    });
  };

  /*
        Returns a fully formed url to call the sign endpoint
        chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_kylin", 'ore_main', 'eos_test', etc.
    */
  OreId.prototype.getOreIdSignUrl = function (signOptions) {
    return __awaiter(this, void 0, void 0, function () {
      let account; let broadcast; let callbackUrl; let chainAccount; let chainNetwork; let state; let transaction; let accountIsTransactionPermission; let oreIdUrl; let appAccessToken; let encodedTransaction; let
        optionalParams;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            account = signOptions.account, broadcast = signOptions.broadcast, callbackUrl = signOptions.callbackUrl, chainAccount = signOptions.chainAccount, chainNetwork = signOptions.chainNetwork, state = signOptions.state, transaction = signOptions.transaction, accountIsTransactionPermission = signOptions.accountIsTransactionPermission;
            oreIdUrl = this.options.oreIdUrl;
            if (!account || !callbackUrl || !transaction) {
              throw new Error('Missing a required parameter');
            }
            // default chainAccount is the same as the user's account
            if (!chainAccount) {
              chainAccount = account;
            }
            return [4 /* yield */, this.getAccessToken()];
          case 1:
            appAccessToken = _a.sent();
            encodedTransaction = Base64.encode(JSON.stringify(transaction));
            optionalParams = (state) ? `&state=${Base64.encode(JSON.stringify(state))}` : '';
            optionalParams += (accountIsTransactionPermission) ? `&account_is_transaction_permission=${accountIsTransactionPermission}` : '';
            return [2 /* return */, `${oreIdUrl}/sign#app_access_token=${appAccessToken}&account=${account}&broadcast=${broadcast}&callback_url=${encodeURIComponent(callbackUrl)}&chain_account=${chainAccount}&chain_network=${chainNetwork}&transaction=${encodedTransaction}${optionalParams}`];
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
    var state;
    const { account } = params;
    var { state } = params;
    const errors = this.getErrorCodesFromParams(params);
    return { account, state, errors };
  };

  /*
        Extracts the response parameters on the /sign callback URL string
    */
  OreId.prototype.handleSignResponse = function (callbackUrlString) {
    let signedTransaction;
    var state;
    const params = urlParamsToArray(callbackUrlString);
    const encodedTransaction = params.signed_transaction; var
      { state } = params;
    const errors = this.getErrorCodesFromParams(params);
    if (!errors) {
      // Decode base64 parameters
      signedTransaction = tryParseJSON(base64DecodeSafe(encodedTransaction));
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
      let responseJson; let
        userInfo;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4 /* yield */, this.callOreIdApi(`account/user?account=${account}`)];
          case 1:
            responseJson = _a.sent();
            userInfo = responseJson;
            this.saveUserLocally(userInfo);
            return [4 /* yield */, this.loadUserLocally()];
          case 2:
            _a.sent(); // ensures this.user state is set
            return [2 /* return */, userInfo];
        }
      });
    });
  };

  /*
        Get the config (setting) values of a specific type
    */
  OreId.prototype.getConfigFromApi = function (configType) {
    return __awaiter(this, void 0, void 0, function () {
      let responseJson; let results; let
        values;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!configType) {
              throw new Error('Missing a required parameter: configType');
            }
            return [4 /* yield */, this.callOreIdApi(`services/config?type=${configType}`)];
          case 1:
            responseJson = _a.sent();
            results = responseJson;
            values = (results || {}).values;
            if (!values) {
              throw new Error(`Not able to retrieve config values for ${configType}`);
            }
            return [2 /* return */, values];
        }
      });
    });
  };

  /*
        Adds a public key to an account with a specific permission name
        The permission name must be one defined in the App Registration record (Which defines its parent permission as well as preventing adding rougue permissions)
        This feature allows your app to hold private keys locally (for certain actions enabled by the permission) while having the associated public key in the user's account
        chainAccount = name of the account on the chain - 12/13-digit string on EOS and Ethereum Address on ETH - it may be the same as the account
        chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_kylin", 'ore_main', 'eos_test', etc.
    */
  OreId.prototype.addPermission = function (account, chainAccount, chainNetwork, publicKey, parentPermission, permission, provider) {
    return __awaiter(this, void 0, void 0, function () {
      let optionalParams; let
        responseJson;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            optionalParams = (provider) ? `&wallet-type=${provider}` : '';
            optionalParams += (parentPermission) ? `&parent-permission=${parentPermission}` : '';
            return [4 /* yield */, this.callOreIdApi(`account/add-permission?account=${account}&chain-account=${chainAccount}&chain-network=${chainNetwork}&permission=${permission}&public-key=${publicKey}${optionalParams}`),
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
    const errorMessage = params.error_message;
    if (errorString) {
      errorCodes = errorString.split(/[/?/$&]/);
    }
    if (errorCodes || errorMessage) {
      errorCodes = errorCodes || [];
      errorCodes.push(errorMessage);
    }

    return errorCodes;
  };

  /*
        We don't really maintain a logged-in state
        However, we do have local cached user data, so clear that
    */
  OreId.prototype.logout = function () {
    // clear local state
    this.clearLocalState();
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
      this.user = null;
      return null;
    }
    this.user = JSON.parse(serialized);
    return this.user;
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
// # sourceMappingURL=index.js.map
