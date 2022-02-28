import {
  AppAccessTokenMetadata,
  GetOreIdAuthUrlParams,
  GetOreIdNewAccountUrlParams,
  GetOreIdRecoverAccountUrlParams,
  GetRecoverAccountUrlResult,
  SignOptions,
} from '.'
import Helpers from '../utils/helpers'
import OreIdContext from './IOreidContext'

const { isNullOrEmpty } = Helpers

/** Returns a fully formed url to create a new chain account within a user's wallet account
 *  This function calls the /new-account web endpoint
 *  It requires an apiKey in order to add an appAccessToken with new account metadata
 *  Returns: Callback returns chainAccount - for the new account */
export async function getOreIdNewAccountUrl(oreIdContext: OreIdContext, args: GetOreIdNewAccountUrlParams) {
  const {
    account,
    accountType,
    chainNetwork,
    accountOptions,
    provider,
    callbackUrl,
    backgroundColor,
    state,
    processId,
    // accessToken,
  } = args
  const { oreIdUrl } = oreIdContext.options

  // collect additional params embedded into appAccessToken
  const appAccessTokenMetadata: AppAccessTokenMetadata = {
    paramsNewAccount: {
      account,
      accountType,
      chainNetwork,
      accountOptions,
    },
  }

  if (!account || !accountType || !chainNetwork || !provider || !callbackUrl) {
    throw new Error('Missing a required parameter')
  }

  // optional params
  const encodedStateParam = state ? `&state=${state}` : ''
  const processIdParam = processId ? `&process_id=${processId}` : ''
  // const accessTokenParam = !isNullOrEmpty(accessToken) ? `&oauth_access_token=${accessToken}` : ''

  const url =
    `${oreIdUrl}/new-account#provider=${provider}&chain_network=${chainNetwork}` +
    `&callback_url=${encodeURIComponent(callbackUrl)}&background_color=${encodeURIComponent(
      backgroundColor,
    )}${encodedStateParam}${processIdParam}`
  return oreIdContext.addAccessTokenAndHmacToUrl(url, appAccessTokenMetadata)
}

/** Returns a fully formed url to login a user
 *  This function calls the /auth web endpoint
 *  Returns: Callback returns account, and optionally accessToken and/or idToken for user */
export async function getOreIdAuthUrl(oreIdContext: OreIdContext, args: GetOreIdAuthUrlParams) {
  const {
    code,
    email,
    phone,
    provider,
    callbackUrl,
    backgroundColor,
    state,
    linkToAccount,
    processId,
    returnAccessToken,
    returnIdToken,
  } = args
  const { oreIdUrl } = oreIdContext.options

  if (!provider || !callbackUrl) {
    throw new Error('Missing a required parameter')
  }

  // optional params
  const encodedStateParam = state ? `&state=${state}` : ''
  const linkToAccountParam = linkToAccount ? `&link_to_account=${linkToAccount}` : ''
  const processIdParam = processId ? `&process_id=${processId}` : ''

  // handle passwordless params
  const codeParam = code ? `&code=${code}` : ''
  const emailParam = email ? `&email=${encodeURIComponent(email)}` : ''
  const phoneParam = phone ? `&phone=${encodeURIComponent(phone)}` : '' // if user passes in +12103334444, the plus sign needs to be URL encoded

  const returnAccessTokenParam = returnAccessToken ? `&return_access_token=${returnAccessToken}` : ''
  const returnIdTokenParam = returnIdToken ? `&return_id_token=${returnIdToken}` : ''

  const url =
    `${oreIdUrl}/auth#provider=${provider}` +
    `${codeParam}${emailParam}${phoneParam}` +
    `&callback_url=${encodeURIComponent(callbackUrl)}&background_color=${encodeURIComponent(
      backgroundColor,
    )}${linkToAccountParam}${encodedStateParam}${processIdParam}${returnAccessTokenParam}${returnIdTokenParam}`

  return oreIdContext.addAccessTokenAndHmacToUrl(url, null)
}

/** Returns a fully formed url to login a user
 *  This function calls the /sign web endpoint
 *  Returns: Callback returns transactionId (if available), and optionally signedTransaction */
export async function getOreIdSignUrl(oreIdContext: OreIdContext, signOptions: SignOptions) {
  const {
    account,
    allowChainAccountSelection,
    broadcast,
    callbackUrl,
    chainNetwork,
    expireSeconds,
    multiSigChainAccounts,
    processId,
    provider,
    returnSignedTransaction,
    signedTransaction,
    state,
    transaction,
    transactionRecordId,
    // userPassword,
  } = signOptions
  let { chainAccount } = signOptions
  const { oreIdUrl } = oreIdContext.options
  // Now always appends accessToken to signUrl
  const { accessToken } = this
  if (!account || !callbackUrl || (!transaction && !signedTransaction)) {
    throw new Error('Missing a required parameter')
  }

  // default chainAccount is the same as the user's account
  if (!chainAccount) {
    chainAccount = account
  }

  const encodedTransaction = Helpers.base64Encode(transaction)
  const encodedSignedTransaction = Helpers.base64Encode(signedTransaction)
  let optionalParams = state ? `&state=${state}` : ''
  optionalParams += !isNullOrEmpty(transaction) ? `&transaction=${encodedTransaction}` : ''
  optionalParams += !isNullOrEmpty(signedTransaction) ? `&signed_transaction=${encodedSignedTransaction}` : ''
  optionalParams += !isNullOrEmpty(allowChainAccountSelection)
    ? `&allow_chain_account_selection=${allowChainAccountSelection}`
    : ''
  optionalParams += !isNullOrEmpty(expireSeconds) ? `&expire_seconds=${expireSeconds}` : ''
  optionalParams += !isNullOrEmpty(multiSigChainAccounts) ? `&multisig_chain_accounts=${multiSigChainAccounts}` : ''
  optionalParams += !isNullOrEmpty(provider) ? `&provider=${provider}` : ''
  optionalParams += !isNullOrEmpty(returnSignedTransaction)
    ? `&return_signed_transaction=${returnSignedTransaction}`
    : ''
  optionalParams += !isNullOrEmpty(transactionRecordId) ? `&transaction_record_id=${transactionRecordId}` : ''
  optionalParams += !isNullOrEmpty(processId) ? `&process_id=${processId}` : ''
  optionalParams += !isNullOrEmpty(accessToken) ? `&oauth_access_token=${accessToken}` : ''

  // prettier-ignore
  const url = `${oreIdUrl}/sign#account=${account}&broadcast=${broadcast}&callback_url=${encodeURIComponent(callbackUrl)}&chain_account=${chainAccount}&chain_network=${encodeURIComponent(chainNetwork)}${optionalParams}`
  return oreIdContext.addAccessTokenAndHmacToUrl(url, null)
}

/** Returns a fully formed url to recover a user's account (e.g. change password)
 *  This function calls the /recover-account web endpoint
 *  Returns: Callback returns account updated */
export async function getRecoverAccountUrl(
  oreIdContext: OreIdContext,
  args: GetOreIdRecoverAccountUrlParams,
): Promise<GetRecoverAccountUrlResult> {
  const {
    account,
    code,
    email,
    phone,
    provider,
    callbackUrl,
    backgroundColor,
    state,
    recoverAction,
    processId,
    overrideAppAccessToken,
  } = args
  const { oreIdUrl } = oreIdContext.options

  if (!provider || !callbackUrl) {
    throw new Error('Missing a required parameter')
  }

  // optional params
  const encodedStateParam = state ? `&state=${state}` : ''
  const processIdParam = processId ? `&process_id=${processId}` : ''
  const actionTypeParam = recoverAction ? `&recover_action=${recoverAction}` : ''

  // handle passwordless params
  const codeParam = code ? `&code=${code}` : ''
  const emailParam = email ? `&email=${encodeURIComponent(email)}` : ''
  const phoneParam = phone ? `&phone=${encodeURIComponent(phone)}` : '' // if user passes in +12103334444, the plus sign needs to be URL encoded

  const url =
    `${oreIdUrl}/recover-account#provider=${provider}` +
    `&account=${account}` +
    `${codeParam}${emailParam}${phoneParam}` +
    `&callback_url=${encodeURIComponent(callbackUrl)}&background_color=${encodeURIComponent(
      backgroundColor,
    )}${actionTypeParam}${encodedStateParam}${processIdParam}`

  return oreIdContext.addAccessTokenAndHmacToUrl(url, null, overrideAppAccessToken)
}
