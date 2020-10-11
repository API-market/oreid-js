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

/* eslint-disable no-param-reassign */
// Generic async handler for Express Middleware
export const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export function authCallbackHandler(oreId) {
  return asyncHandler(async (req, res, next) => {
    const { query } = req
    if (!query) {
      return {}
    }

    oreId.errors = null

    const response = oreId.handleAuthResponse(req.originalUrl)
    const { accessToken, account, errors, idToken, processId, state } = response

    if (errors) {
      oreId.errors = errors
      const error = new Error(`Errors Processing auth callback: ${errors.join(', ')}`)
      return next(error)
    }

    // Add data to request object
    req.appId = oreId.appId
    if (accessToken) {
      req.accessToken = accessToken
    }
    if (idToken) {
      req.idToken = idToken
    }
    if (processId) {
      req.processId = processId
    }
    if (state) {
      req.state = state
    }

    // attach user data to request object
    if (account) {
      const user = await oreId.getUserInfoFromApi(account, processId) // get user from server and also save in local cookie (or state)
      // remove processId from user results and attach to request object instead
      if (user?.processId) {
        req.processId = user.processId
        delete user.processId
      }
      req.user = user
    }

    return next()
  })
}

/*
    Process the response from the /sign endpoint
    attach signedTransaction to HTTP request
*/
export function signCallbackHandler(oreId) {
  return asyncHandler(async (req, res, next) => {
    const { body } = req
    if (!body) {
      return {}
    }

    oreId.errors = null
    const { signedTransaction, state, processId, transactionId, errors } = oreId.handleSignResponse(body)

    if (errors) {
      oreId.errors = errors
      const error = new Error(`Errors Processing sign callback: ${errors.join(', ')}`)
      return next(error)
    }

    if (processId) {
      req.processId = processId
    }

    if (signedTransaction) {
      req.signedTransaction = signedTransaction
      req.appId = oreId.appId
    }

    if (transactionId) {
      req.transactionId = transactionId
    }

    // Add state to request object
    if (state) {
      req.state = state
    }

    return next()
  })
}
