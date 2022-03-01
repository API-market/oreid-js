import OreIdContext from '../../core/IOreidContext'
import {
  AccountName,
  ApiEndpoint,
  ChainAccount,
  ChainNetwork,
  RequestType,
  ServiceAccountUsedFor,
  SignOptions,
} from '../../models'
import { ApiResultWithErrorCode } from '../models'
import {
  assertHasApiKeyOrAccessToken,
  assertParamsHaveOnlyOneOfValues,
  assertParamsHaveRequiredValues,
} from '../helpers'
import Helpers from '../../utils/helpers'

export type ApiSignTransactionParams = {
  autoSign?: boolean
  signOptions: SignOptions
}

export type ApiSignTransactionBodyParams = {
  account: AccountName
  allow_chain_account_selection?: boolean
  auto_sign?: boolean
  broadcast?: boolean
  chain_account: ChainAccount
  chain_network: ChainNetwork
  expire_seconds?: number
  generate_auto_sign_credential?: boolean
  multisig_chain_accounts?: string
  // provider?: AuthProvider
  return_signed_transaction?: boolean
  signed_transaction?: string
  transaction?: string
  transaction_chain_acccount?: ChainAccount
  transaction_record_id?: string
  user_password?: string
  user_password_encrypted?: string
}

export type ApiSignTransactionResult = {
  signedTransaction?: string
  transactionId?: string
} & ApiResultWithErrorCode

/** Compose the API body params for calling signTransaction */
function composeSignBodyFromSignOptions(params: ApiSignTransactionParams): ApiSignTransactionBodyParams {
  const {
    account,
    allowChainAccountSelection,
    broadcast,
    chainAccount,
    chainNetwork,
    expireSeconds,
    generateAutoSignCredential,
    multiSigChainAccounts,
    returnSignedTransaction,
    signedTransaction: signedTransactionParam,
    transaction: transactionParam,
    transactionChainAccount,
    transactionRecordId,
    userPassword,
    userPasswordEncrypted,
  } = params.signOptions

  const { autoSign } = params

  const body: ApiSignTransactionBodyParams = {
    account,
    broadcast,
    chain_account: chainAccount,
    chain_network: chainNetwork,
  }

  if (allowChainAccountSelection) body.allow_chain_account_selection = allowChainAccountSelection
  if (autoSign) body.auto_sign = autoSign
  if (expireSeconds) body.expire_seconds = expireSeconds
  if (generateAutoSignCredential) body.generate_auto_sign_credential = generateAutoSignCredential
  if (multiSigChainAccounts) body.multisig_chain_accounts = multiSigChainAccounts
  // if (provider) body.provider = provider - no provider param for API call
  if (returnSignedTransaction) body.return_signed_transaction = returnSignedTransaction
  if (signedTransactionParam) body.signed_transaction = Helpers.base64Encode(signedTransactionParam)
  // if (stateParam) body.state = Helpers.base64Encode(stateParam) - no state for an API call
  if (transactionChainAccount) body.transaction_chain_acccount = transactionChainAccount
  if (transactionParam) body.transaction = Helpers.base64Encode(transactionParam)
  if (transactionRecordId) body.transaction_record_id = transactionRecordId
  if (userPassword) body.user_password = userPassword // used for custodial sign
  if (userPasswordEncrypted) body.user_password_encrypted = userPasswordEncrypted // used for custodial sign

  return body
}

/** convert snake_case fields in response to camelCase */
function mapSignResultFromApi(apiResult: any): ApiSignTransactionResult {
  const { signed_transaction: signedTransaction, transaction_id: transactionId, ...rest } = apiResult
  return {
    signedTransaction,
    transactionId,
    ...rest,
  }
}

/** Call api transaction/sign - to sign a transaction for a user
 * Can only sign a transaction if autoSign specified (and previously enabled by user)
 * OR if OreId is managing a private key it can sign with (e.g. most often an account in multiSigChainAccounts)
 * For autoSign param, requires a serviceKey with the autoSign right
 * Returns: stringified signedTransaction (and transactionId if available)
 *          OR errorCode, errorDescription, message - if any issues
 * */
export async function callApiSignTransaction(
  oreIdContext: OreIdContext,
  params: ApiSignTransactionParams,
): Promise<ApiSignTransactionResult> {
  const apiName = ApiEndpoint.TransactionSign

  if (params?.autoSign) {
    if (!oreIdContext.options?.serviceKey) {
      throw new Error(
        `Missing required header for API ${apiName}: Must have a options.serviceKey with ${ServiceAccountUsedFor.AutoSigning} right.`,
      )
    }
  }

  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params.signOptions, ['account', 'chainNetwork', 'chainAccount'], apiName)
  assertParamsHaveOnlyOneOfValues(params.signOptions, ['transaction', 'signedTransaction'], apiName)

  const body = composeSignBodyFromSignOptions(params)

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.TransactionSign, body, null)
  return mapSignResultFromApi(results)
}

/** Call api custodial/sign - for signing a transaction on behalf of a user
 * Requires wallet password: either user_password or user_password_encrypted param (used to decrypt user's key)
 * Requires a serviceKey with the proxySign right
 * Returns: stringified signedTransaction (and transactionId if available)
 *          OR errorCode, errorDescription, message - if any issues
 * */
export async function callApiCustodialSignTransaction(
  oreIdContext: OreIdContext,
  params: ApiSignTransactionParams,
): Promise<ApiSignTransactionResult> {
  const apiName = ApiEndpoint.CustodialSign

  if (!oreIdContext.options?.serviceKey) {
    throw new Error(
      `Missing required header for API ${apiName}: Must have a options.serviceKey with ${ServiceAccountUsedFor.ProxySigning} right`,
    )
  }

  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params.signOptions, ['account', 'chainNetwork', 'chainAccount'], apiName)
  assertParamsHaveOnlyOneOfValues(params.signOptions, ['transaction', 'signedTransaction'], apiName)
  assertParamsHaveOnlyOneOfValues(params.signOptions, ['userPassword', 'userPasswordEncrypted'], apiName)

  const body = composeSignBodyFromSignOptions(params)

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.CustodialSign, body, null)
  return mapSignResultFromApi(results)
}
