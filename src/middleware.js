/*
    Usage Example:
    import {asyncHandler, authCallbackHandler, signCallbackHandler} from './middleware';
    let oreId = OreId({appId});
    app.use('/authcallback', asyncHandler((req, res, next) => {  authCallbackHandler(req, res, next) }));
    app.use('/signcallback', asyncHandler((req, res, next) => {  signCallbackHandler(req, res, next) }));
*/

/* 
    Process the response from the /auth endpoint
    attach user to request
*/
export function authCallbackHandler(oreId) {
    return async function(req, res, next) {
        let { query } = req;
        if(!query) { return {}; }

        oreId.errors = null;
        let response = oreId.handleAuthResponse(req.originalUrl);
        let {account, state, errors} = response;
        //attach user data to request object
        if(!errors) {
            let user = await oreId.getUserInfo(account); //get user from server and also save in local cookie (or state)
            req.user = user;
            req.appId = oreId.appId;
            console.log(`authCallbackHandler found account`,account)
        }
        else {
            oreId.errors = errors;
        }
        return next();
    };
}

/* 
    Process the response from the /sign endpoint
    attach signedTransaction to request
*/
export function signCallbackHandler(oreId) {
    return async function(req, res, next) {
        let { body } = req;
        if(!body) { return {}; }

        oreId.errors = null;
        let {signedTransaction, state, errors} = oreId.handleSignResponse(body);
        //attach user data to request object
        if(!errors) {
            req.signedTransaction = signedTransaction;
            req.appId = oreId.appId;
        }
        else {
            oreId.errors = errors;
        }
        return next();
    };
}

//Generic async handler for Express Middleware
export const asyncHandler = fn => (req, res, next) => {
    Promise
      .resolve(fn(req, res, next))
      .catch(next)
}
