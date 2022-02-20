import { ApiEndpoint, OreIdOptions, ProcessId, RequestType } from '../models'
import AccessTokenHelper from '../auth/accessTokenHelper'
import LocalState from './localState'

/** interface to pass OreId members to helper classes (e.g. User) */
export interface OreIdContext {
  options: OreIdOptions
  accessToken: string
  accessTokenHelper: AccessTokenHelper
  localState: LocalState
  callOreIdApi: (
    requestMethod: RequestType,
    endpoint: ApiEndpoint,
    params: { [key: string]: any },
    overrideAccessToken?: string,
    processId?: ProcessId,
  ) => Promise<any>
}
