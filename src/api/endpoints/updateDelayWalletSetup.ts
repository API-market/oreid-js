import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, ProcessId, RequestType } from '../../models'
import { assertHasApiKeyOrAccessToken, assertParamsHaveRequiredValues } from '../helpers'

export type ApiUpdateDelayWalletSetupParams = {
  account?: string
  /** new value for wallet.delayWalletSetup property */
  delayWalletSetup?: boolean
}

export type ApiUpdateDelayWalletSetupBodyParams = {
  account?: string
  delay_wallet_setup?: boolean
}

export type CallApiUpdateDelayWalletSetupResult = {
  success: boolean
  processId: ProcessId
}

/** Call the account/update-delay-wallet-setup api
 * Sets the value of the wallet's delayWalletSetup flag
 * Can only be updated if the wallet is not yet setup (wallet.requiresWalletSetup = false)
 * Returns: success: true (or throws an error)
 * */
export async function callApiUpdateDelayWalletSetup(
  oreIdContext: OreIdContext,
  params: ApiUpdateDelayWalletSetupParams,
): Promise<CallApiUpdateDelayWalletSetupResult> {
  const apiName = ApiEndpoint.UpdateDelayWalletSetup
  const { account, delayWalletSetup } = params

  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params, ['account', 'delayWalletSetup'], apiName)

  const body: ApiUpdateDelayWalletSetupBodyParams = {
    account: account,
    delay_wallet_setup: delayWalletSetup,
  }

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.UpdateDelayWalletSetup, body, null)
  return results // success: true
}
