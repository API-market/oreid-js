import { OreIdContext } from '../../utils/iOreidContext'
import {
  AccountName,
  ApiEndpoint,
  ChainAccount,
  ChainNetwork,
  ProcessId,
  RequestType,
  ServiceAccountUsedFor,
  SignOptions,
} from '../../models'
import {
  assertHasApiKeyOrAccessToken,
  assertHasServiceKey,
  assertParamsHaveOnlyOneOfValues,
  assertParamsHaveRequiredValues,
} from '../helpers'
import Helpers from '../../utils/helpers'

export type ApiCanAutosignTransactionBodyParams = {
  account: AccountName
  chain_account: ChainAccount
  chain_network: ChainNetwork
  processId?: ProcessId
  signed_transaction?: string
  transaction?: string
  transaction_chain_acccount?: string
}

export type ApiCanAutosignTransactionResults = {
  autoSignCredentialsExist: boolean
  canCreateAutoSignCredentials: boolean
  maxAutoSignValidForInSeconds: number
  processId: ProcessId
}

/** Call api transaction/can-auto-sign
 * Requires a serviceKey with the autoSign right
 * Returns: true if transaction provided can be signed using the signTransaction(autosign:true)
 * */
export async function callApiCanAutosignTransaction(
  oreIdContext: OreIdContext,
  params: SignOptions,
): Promise<ApiCanAutosignTransactionResults> {
  const apiName = ApiEndpoint.CanAutoSign
  const {
    account,
    chainAccount,
    chainNetwork,
    processId,
    signedTransaction,
    transaction,
    transactionChainAccount,
  } = params

  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertHasServiceKey(oreIdContext, ServiceAccountUsedFor.AutoSigning, apiName)
  assertParamsHaveRequiredValues(params, ['account', 'chainNetwork', 'chainAccount'], apiName)
  assertParamsHaveOnlyOneOfValues(params, ['transaction', 'signedTransaction'], apiName)

  const body: ApiCanAutosignTransactionBodyParams = {
    account,
    chain_account: chainAccount,
    chain_network: chainNetwork,
    processId,
  }

  if (transaction) body.transaction = Helpers.base64Encode(transaction)
  if (signedTransaction) body.signed_transaction = Helpers.base64Encode(signedTransaction)
  if (transaction) body.transaction_chain_acccount = transactionChainAccount

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.CanAutoSign, body, null, processId)
  return results
}