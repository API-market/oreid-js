import OreIdContext from '../core/IOreidContext'
import Helpers from '../utils/helpers'
import { AccountName, AuthProvider, ChainAccount, ChainNetwork, ProcessId, UserInfo, WalletPermission } from '../models'
import { callApiGetUser, ApiGetUserParams } from '../api'
import { callApiAddPermission } from '../api/endpoints/addPermission'

const { isNullOrEmpty } = Helpers

export class User {
  constructor(args: { oreIdContext: OreIdContext }) {
    this.oreIdContext = args.oreIdContext
  }

  private oreIdContext: OreIdContext

  /** User's basic information and blockchain accounts (aka permissions) */
  info: UserInfo

  /** User's OreID (accountName) */
  get accountName(): string {
    return this.oreIdContext.localState?.user?.accountName
  }

  /** We have a valid access token for the current user */
  get isLoggedIn(): boolean {
    return !!this.oreIdContext.accessToken
  }

  /** Get the user info from ORE ID for a given user account and (usually) save the user into localStorage 'cache'
   *  If accessToken exists, account param is optional (it will be extracted from token)
   *  If accessToken exists and the account param provided doesn't match the accessToken, the user will be returned but not saved to local storage
   */
  async getUserInfoFromApi(account?: AccountName, processId: ProcessId = null): Promise<UserInfo> {
    let accountAndAccessTokenMismatch = false
    let accountParam = account
    // eslint-disable-next-line prefer-destructuring
    const accessToken = this.oreIdContext.accessToken // getting the accessToken here will delete existing accessToken if it's now expired
    // get account specified in access token
    if (!account && accessToken) {
      accountParam = this.oreIdContext.accessTokenHelper?.accountName
    } else if (account && account !== this.oreIdContext.accessTokenHelper?.accountName) {
      accountAndAccessTokenMismatch = true
    }
    if (!accountParam) return null // throw new Error('Missing account param (or accessToken with embedded /account claim)')
    const params: ApiGetUserParams = { account: accountParam, processId }
    const userInfo = await callApiGetUser(this.oreIdContext, params)

    // if we've retrieved an account that doesn't match the current access token, don't save the account in localStorage, just return it
    if (!accountAndAccessTokenMismatch) {
      this.oreIdContext.localState.saveUser(userInfo)
    }
    return userInfo
  }

  /** Returns user from local storage (if saved there)
    if no locally stored user, retrieves the user matching the accountName provided (or for the current accessToken if not provided)
    Retrieved user is saved to local storage - UNLESS the accountName param does not match the user in the current accessToken
    To force a retrieval of the latest data from the API, pass refresh = true */
  async getUser(accountName: AccountName = null, refresh = false, processId: ProcessId = null) {
    // return the cached user if we have it and matches the accountName
    if (!refresh) {
      const cachedUser = this.oreIdContext.localState.user
      if (!isNullOrEmpty(cachedUser)) {
        if (!isNullOrEmpty(accountName)) {
          if (cachedUser.accountName === accountName) {
            return cachedUser
          }
        } else {
          // no accountName specified - just return the user from local storage
          return cachedUser
        }
      }
    }

    // saves user info in local state (unless accountName doesn't match current accessToken)
    return this.getUserInfoFromApi(accountName, processId)
  }

  /** Update permissions for oreAccount in OreID service
   *  If oreAccount is not provided, we'll use the local state value for it for the logged in user
   */
  async updatePermissionsIfNecessary(
    chainAccount: ChainAccount,
    permissions: WalletPermission[],
    chainNetwork: ChainNetwork,
    provider: AuthProvider,
    oreAccount: AccountName = null,
  ) {
    // use logged-in account if missing oreAccount param
    const oreAcct = oreAccount || this.oreIdContext.localState.accountName()

    if (oreAcct) {
      await this.addWalletPermissionsToOreIdAccount(chainAccount, chainNetwork, permissions, oreAcct, provider)
    } else {
      console.log('updatePermissionsIfNecessary: oreAccount param was not provided and cant be determined')
    }
  }

  // for each permission in the wallet, add to ORE ID (if not in user's record)
  /** for all walletPermissions not already in the user's OreID wallet, add it by calling the api (addPermission) */
  async addWalletPermissionsToOreIdAccount(
    chainAccount: ChainAccount,
    chainNetwork: ChainNetwork,
    walletPermissions: WalletPermission[],
    oreAccount: AccountName,
    provider: AuthProvider,
  ) {
    if (isNullOrEmpty(oreAccount) || isNullOrEmpty(walletPermissions) || isNullOrEmpty(chainNetwork)) {
      return
    }

    const targetUser = await this.getUser(oreAccount, true)

    // for each permission provided, check if it's already in the user's list, if not, add it by calling the api (addPermission)
    await Helpers.asyncForEach(walletPermissions, async p => {
      const permission = p.name
      let parentPermission = p.parent
      if (!parentPermission) {
        // HACK: assume parent permission - its missing from the discover() results
        parentPermission = 'active'

        if (permission === 'owner') {
          parentPermission = ''
        } else if (permission === 'active') {
          parentPermission = 'owner'
        }
      }
      // filter out permission that the user already has in his record
      const skipThisPermission = targetUser.permissions.some(
        up =>
          (up.chainAccount === chainAccount && up.chainNetwork === chainNetwork && up.permission === permission) ||
          permission === 'owner',
      )

      // don't add 'owner' permission and skip ones that are already stored in user's account
      if (skipThisPermission !== true) {
        // let publicKey = p.required_auth.keys[0].key; //TODO: Handle multiple keys and weights
        const { publicKey } = p
        // if call is successful, nothing is returned in response (except processId)
        await callApiAddPermission(this.oreIdContext, {
          account: oreAccount,
          chainAccount,
          chainNetwork,
          publicKey,
          parentPermission,
          permission,
          provider,
        })
      }
    })

    // reload user to get updated permissions
    await this.getUser(oreAccount, true)
  }

  //   /**  Adds a public key to an account with a specific permission name
  //     The permission name must be one defined in the App Registration record (Which defines its parent permission as well as preventing adding rougue permissions)
  //     This feature allows your app to hold private keys locally (for certain actions enabled by the permission) while having the associated public key in the user's account
  //     chainAccount = name of the account on the chain - 12/13-digit string on EOS and Ethereum Address on ETH - it may be the same as the account
  //     chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_jungle', 'eos_kylin", 'ore_main', 'eos_test', etc.
  //   */
  //   async addPermission(
  //     account: AccountName,
  //     chainAccount: ChainAccount,
  //     chainNetwork: ChainNetwork,
  //     publicKey: PublicKey,
  //     parentPermission: PermissionName,
  //     permission: PermissionName,
  //     provider: AuthProvider,
  //     processId?: ProcessId,
  //   ): Promise<AddPermissionResponse> {
  //     const optionalParams: { [key: string]: any } = {}

  //     if (provider) {
  //       optionalParams['wallet-type'] = provider
  //     }

  //     if (parentPermission) {
  //       optionalParams['parent-permission'] = parentPermission
  //     }

  //     const queryParams = {
  //       account,
  //       'chain-account': chainAccount,
  //       'chain-network': chainNetwork,
  //       'public-key': publicKey,
  //       permission,
  //       ...optionalParams,
  //     }

  //     // if failed, error will be thrown
  //     // TODO: make this a post request on the api
  //     const response = await this.oreIdContext.callOreIdApi(
  //       RequestType.Get,
  //       ApiEndpoint.AddPermission,
  //       queryParams,
  //       null,
  //       processId,
  //     )
  //     return response
  //   }
}
