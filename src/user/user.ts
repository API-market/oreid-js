import OreIdContext from '../core/IOreidContext'
import Helpers from '../utils/helpers'
import { AccountName, ChainAccount, ChainNetwork, ExternalWalletType, UserInfo, WalletPermission } from '../models'
import { callApiGetUser, ApiGetUserParams } from '../api'
import { callApiAddPermission } from '../api/endpoints/addPermission'
import AccessTokenHelper from '../auth/accessTokenHelper'

const { isNullOrEmpty } = Helpers

export default class User {
  constructor(args: { oreIdContext: OreIdContext; accessTokenHelper: AccessTokenHelper }) {
    this._oreIdContext = args.oreIdContext
    this._accessTokenHelper = args.accessTokenHelper // reference to current accessToken, etc.
    this._accountName = this._oreIdContext?.accessTokenHelper?.accountName
  }

  // pulled from the accessToken
  private _accountName: AccountName

  private _accessTokenHelper: AccessTokenHelper

  private _oreIdContext: OreIdContext

  /** User's basic information and blockchain accounts (aka permissions) */
  private _info: UserInfo

  /** User's OreID (accountName) */
  get accountName(): AccountName {
    return this._accountName
  }

  /** User's personal info (e.g. name, email, picture) */
  get info(): UserInfo {
    return this._info
  }

  /** Whether we have a valid access token for the current user */
  get isLoggedIn(): boolean {
    return !!this._accessTokenHelper.accessToken
  }

  /** Get the user info from ORE ID API for a given user account and (usually) save the user into localStorage 'cache'
   *  Must have a valid accessToken to retrieve user
   */
  async getInfo() {
    // eslint-disable-next-line prefer-destructuring
    const accessToken = this._accessTokenHelper.accessToken // getting the accessToken here will delete existing accessToken if it's now expired
    if (!accessToken) {
      throw new Error('AccessToken is missing or has expired')
    }
    // get account specified in access token
    const account = this._accessTokenHelper?.accountName
    const params: ApiGetUserParams = { account }
    const userInfo = await callApiGetUser(this._oreIdContext, params)

    this._accountName = account
    this._info = userInfo
  }

  /** Clears user's accessToken and user profile data */
  logout() {
    this._oreIdContext.logout()
  }

  /** Update permissions for user's ORE Account if any */
  async updatePermissionsIfNecessary(args: {
    chainAccount: ChainAccount
    permissions: WalletPermission[]
    chainNetwork: ChainNetwork
    walletType: ExternalWalletType
  }) {
    // use logged-in account if missing oreAccount param
    await this.addWalletPermissionsToOreIdAccount(args)
  }

  // for each permission in the wallet, add to ORE ID (if not in user's record)
  /** for all walletPermissions not already in the user's OreID wallet, add it by calling the api (addPermission) */
  async addWalletPermissionsToOreIdAccount(args: {
    chainAccount: ChainAccount
    chainNetwork: ChainNetwork
    permissions: WalletPermission[]
    walletType: ExternalWalletType
  }) {
    const { chainAccount, chainNetwork, permissions, walletType } = args
    if (!this.accountName || isNullOrEmpty(permissions) || isNullOrEmpty(chainNetwork)) {
      return // todo: consider if we should exit silently here - since we are called after discovery everytime, then answer is probably yes
    }

    // get latest user info
    await this.getInfo()

    // for each permission provided, check if it's already in the user's list, if not, add it by calling the api (addPermission)
    await Helpers.asyncForEach(permissions, async perm => {
      const permission = perm.name
      let parentPermission = perm.parent
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
      const skipThisPermission = this.info.permissions.some(
        up =>
          (up.chainAccount === chainAccount && up.chainNetwork === chainNetwork && up.permission === permission) ||
          permission === 'owner',
      )

      // don't add 'owner' permission and skip ones that are already stored in user's account
      if (skipThisPermission !== true) {
        // let publicKey = p.required_auth.keys[0].key; //TODO: Handle multiple keys and weights
        const { publicKey } = perm
        // if call is successful, nothing is returned in response (except processId)
        await callApiAddPermission(this._oreIdContext, {
          account: this.accountName,
          chainAccount,
          chainNetwork,
          publicKey,
          parentPermission,
          permission,
          provider: walletType,
        })
      }
    })

    // reload user to get updated permissions
    await this.getInfo()
  }
}
