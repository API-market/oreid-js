import { OreIdContext } from '../../utils/iOreidContext'
import {
  AccountName,
  ApiEndpoint,
  AuthProvider,
  ChainAccount,
  ChainNetwork,
  ProcessId,
  PublicKey,
  RequestType,
} from '../../models'
import { assertHasApiKeyOrAccessToken, assertParamsHaveRequiredValues } from '../helpers'
import { ApiMessageResponse } from '../models'

export type ApiAddPermissionParams = {
  account: AccountName
  chainAccount: ChainAccount
  chainNetwork: ChainNetwork
  parentPermission?: PermissionName
  permission: PermissionName
  processId?: ProcessId
  provider?: AuthProvider
  publicKey: PublicKey
}

/**
 *  Call api account/addPermission
 *  Adds a public key to a user account with a specific permission name
 * The permission name must be one defined in the App Registration record (Which defines its parent permission as well as preventing adding rougue permissions)
 * This feature allows your app to hold private keys locally (for certain actions enabled by the permission) while having the associated public key in the user's account
 * chainAccount = name of the account on the chain - 12/13-digit string on EOS and Ethereum Address on ETH - it may be the same as the account
 * chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_jungle', 'eos_kylin", 'ore_main', 'eos_test', etc.
 * */
export async function callApiAddPermission(
  oreIdContext: OreIdContext,
  params: ApiAddPermissionParams,
): Promise<ApiMessageResponse> {
  const apiName = ApiEndpoint.AddPermission

  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(
    params,
    ['account', 'chainAccount', 'chainNetwork', 'permission', 'publicKey'],
    apiName,
  )

  const { account, permission, processId, provider, parentPermission } = params

  const optionalParams: { [key: string]: any } = {}
  if (provider) optionalParams['wallet-type'] = provider
  if (parentPermission) optionalParams['parent-permission'] = parentPermission

  const queryParams = {
    account,
    'chain-account': params.chainAccount,
    'chain-network': params.chainNetwork,
    'public-key': params.publicKey,
    permission,
    ...optionalParams,
  }

  const response = await oreIdContext.callOreIdApi(
    RequestType.Get,
    ApiEndpoint.AddPermission,
    queryParams,
    null,
    processId,
  )
  return response as ApiMessageResponse
}
