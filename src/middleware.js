/*
    Usage Example:
    import {asyncHandler, authCallbackHandler, signCallbackHandler} from './middleware';
    let oreId = OreId({appId});
    app.use('/authcallback', asyncHandler(authCallbackHandler(oreId)));
    app.use('/signcallback', asyncHandler(signCallbackHandler(oreId)));
*/

/*
    Process the response from the /auth endpoint
    attach user to HTTP request
*/
// Generic async handler for Express Middleware
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export function authCallbackHandler(oreId) {
  return asyncHandler(async (req, res, next) => {
    const { query } = req;
    if (!query) {
      return {};
    }

    oreId.errors = null;

    const response = oreId.handleAuthResponse(req.originalUrl);
    const { account, errors } = response;

    if (errors) {
      oreId.errors = errors;
      const error = new Error(`Errors Processing auth callback: ${errors.join(', ')}`);
      return next(error);
    }

    // attach user data to request object
    if (account) {
      const user = await oreId.getUserInfoFromApi(account); // get user from server and also save in local cookie (or state)
      req.user = user;
      req.appId = oreId.appId;
    }

    return next();
  });
}

/*
    Process the response from the /sign endpoint
    attach signedTransaction to HTTP request
*/
export function signCallbackHandler(oreId) {
  return asyncHandler(async (req, res, next) => {
    const { body } = req;
    if (!body) {
      return {};
    }

    oreId.errors = null;
    const { signedTransaction, errors } = oreId.handleSignResponse(body);

    if (errors) {
      oreId.errors = errors;
      const error = new Error(`Errors Processing sign callback: ${errors.join(', ')}`);
      return next(error);
    }

    if (signedTransaction) {
      req.signedTransaction = signedTransaction;
      req.appId = oreId.appId;
    }

    return next();
  });
}
