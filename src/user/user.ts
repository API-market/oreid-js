import {
  ApiGetUserParams,
  callApiDeleteTestUser,
  callApiGetUser,
  callApiPasswordLessSendCode,
  callApiPasswordLessVerifyCode,
} from '../api'
import { callApiAddPermission } from '../api/endpoints/addPermission'
import OreIdContext from '../core/IOreidContext'
import { getOreIdNewChainAccountUrl } from '../core/urlGenerators'
import Helpers from '../utils/helpers'
import { Observable } from '../utils/observable'
import { AuthProvider, AccountName, ChainAccount, ChainNetwork, ExternalWalletType } from '../common/models'
import { NewAccountOptions, NewAccountWithOreIdResult } from '../core/models'
import {
  UserChainAccount,
  UserData,
  UserPermissionData,
  UserPermissionForChainAccount,
  UserSourceData,
  WalletPermission,
} from './models'
import { AccessTokenHelper } from '../auth/accessTokenHelper'
import { callApiUpdateDelayWalletSetup } from '../api/endpoints/updateDelayWalletSetup'

const { isNullOrEmpty } = Helpers

export type SubscriberUser = (values: User) => void

export class User extends Observable<SubscriberUser> {
  constructor(args: { oreIdContext: OreIdContext; accessTokenHelper: AccessTokenHelper; accountName: AccountName }) {
    super()
    this._oreIdContext = args.oreIdContext
    this._accessTokenHelper = args.accessTokenHelper // reference to current accessToken (via getter)
    this._accountName = args.accountName
    this._accessTokenHelper.subscribe(this.onUpdateAccessTokenHelper)
  }

  // pulled from the accessToken
  private _accountName: AccountName

  private _accessTokenHelper: AccessTokenHelper

  private _oreIdContext: OreIdContext

  /** User's basic information and blockchain accounts (aka permissions) */
  private _userSourceData: UserSourceData

  private get accessToken(): string {
    return this._accessTokenHelper.accessToken
  }

  /** User's OreID (accountName) */
  get accountName(): AccountName {
    return this._accountName
  }

  /** User's personal info (e.g. name, email, picture) */
  get data(): UserData {
    this.assertUserHasData()
    const { permissions, ...otherInfo } = this._userSourceData
    return {
      ...otherInfo,
      chainAccounts: this.getChainAccounts(),
    }
  }

  /** Whether user's data has been retrieved with getData() */
  get hasData() {
    return !isNullOrEmpty(this?._userSourceData)
  }

  private setUserSourceData(userSourceData: UserSourceData) {
    this._userSourceData = userSourceData
    super.callSubscribers()
  }

  /** Return Blockchain accounts associated with the user's OreId account */
  private getChainAccounts(): UserChainAccount[] {
    this.assertUserHasData()
    const chainAccounts = (this._userSourceData.permissions || []).map(perm => {
      const [defaultPermission] = this.getDefaultPermissionForChainAccount(perm.chainAccount, perm.chainNetwork)
      return {
        chainAccount: perm.chainAccount,
        chainNetwork: perm.chainNetwork,
        defaultPermission,
        permissions: this.getPermissionForChainAccount(perm.chainAccount, perm.chainNetwork),
      }
    })
    // only return unique combinations of chainAccount and chainNetwork
    return Helpers.getUniqueValues(chainAccounts)
  }

  /** Whether we have a valid access token for the current user */
  get isLoggedIn(): boolean {
    return !!this.accessToken
  }

  /** runs when accessTokenHelper changes */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onUpdateAccessTokenHelper = (newAccessTokenHelper: AccessTokenHelper) => {
    this._accountName = newAccessTokenHelper.accountName
    super.callSubscribers()
  }

  /** throw if user data hasn't been retrieved yet */
  private assertUserHasData() {
    if (!this.hasData) {
      throw new Error('User data hasnt been retrieved. Call user.getData() first.')
    }
  }

  /** throw if user hasn't have a valid email (i.e. user.email) */
  private assertUserHasValidEmail() {
    this.assertUserHasData()
    const { email } = this?.data || {}
    if (!Helpers.isValidEmail(email)) throw new Error('User doesnt have a valid email')
  }

  /** Get the user info from ORE ID API for a given user account and (usually) save the user into localStorage 'cache'
   *  Must have a valid accessToken to retrieve user
   */
  async getData(forceRefresh?: boolean): Promise<UserData> {
    if (this.hasData && !forceRefresh) return this.data
    // eslint-disable-next-line prefer-destructuring
    const accessToken = this.accessToken
    if (!accessToken) {
      throw new Error('AccessToken is missing or has expired')
    }
    // get account specified in access token
    const account = this?._accountName
    const params: ApiGetUserParams = { account }
    const userSourceData = await callApiGetUser(this._oreIdContext, params)

    this._accountName = account
    this.setUserSourceData(userSourceData)
    return this.data
  }

  /** Clears user's accessToken and user profile data */
  logout() {
    this._oreIdContext.logout()
  }

  /** Request OREID to create a new blockchain account in an existing user's wallet
   *  This is an advanced feature - it most cases, blockchain accounts will be created automatically upon first login
   */
  // async newChainAccount(newAccountOptions: NewAccountOptions) {
  //   // TODO - call API to create chain account (requires apiKey with createAccount right)
  //   // for webwidget, it should just refresh user info upon callback
  // }

  /** Returns a fully formed url to redirect the user's browser to create a new chain account using ORE ID
   *  This function calls the /new-account web endpoint
   *  Returns: Callback returns new chainAccount name */
  async getNewChainAccountUrl(newAccountOptions: NewAccountOptions): Promise<NewAccountWithOreIdResult> {
    const { account, accountType, chainNetwork, accountOptions, provider, state } = newAccountOptions || {}
    const { newAccountCallbackUrl, backgroundColor } = this._oreIdContext.options
    const args = {
      account,
      accountType,
      backgroundColor,
      chainNetwork,
      accountOptions,
      provider,
      callbackUrl: newAccountCallbackUrl,
      state,
    }
    const newAccountUrl = await getOreIdNewChainAccountUrl(this._oreIdContext, args)
    return { newAccountUrl, errors: null }
  }

  /** Delete a test user
   * Test users are created by setting isTestUser:true on first authentication)
   */
  async deleteTestUser() {
    if (!this?.accountName) throw new Error('User not authenticated. Must be logged-in (or have set an accessToken).')
    const result = await callApiDeleteTestUser(this._oreIdContext, {
      account: this.accountName,
    })
    return result
  }

  /** If the user hasn't already setup their wallet, this will prompt the setup on their next interactive authentication
   * Used to turn-off the delayWalletSetup for a user's account
   * delayWalletSetup is enabled by passing delayWalletSetup:true for a user's first authentication (e.g. popup.auth(delayWalletSetup:true))
   * Delayed Wallet Setup allows a user to login without creating blockchain accounts right away
   * Call this function (to disable delayWalletSetup) just before the user needs a blockchain account (e.g. before signing a transaction)
   */
  async disableDelayedWalletSetup() {
    if (!this?.accountName) throw new Error('User not authenticated. Must be logged-in (or have set an accessToken).')
    const result = await callApiUpdateDelayWalletSetup(this._oreIdContext, {
      account: this.accountName,
      delayWalletSetup: false,
    })
    await this.getData(true)
    return result
  }

  /** Send a code to the user's primary email (user.email) - in order to verify the user has access to it
   *  After sending the code, use checkVerificationCodeForEmail() to verify that the user received the code */
  async sendVerificationCodeToEmail() {
    this.assertUserHasValidEmail()
    const result = await callApiPasswordLessSendCode(this._oreIdContext, {
      email: this?.data?.email,
      provider: AuthProvider.Email,
    })
    return result
  }

  /** Confirm that the code matches the last one just sent to the email by sendVerificationCodeToEmail() */
  async checkVerificationCodeForEmail({ code }: { code: string }) {
    this.assertUserHasValidEmail()
    const result = await callApiPasswordLessVerifyCode(this._oreIdContext, {
      code,
      email: this?.data?.email,
      provider: AuthProvider.Email,
    })
    return result
  }

  // TODO: rename sendVerificationCodeToEmail - passwordlessVerificationSendCode(type, email, phone)
  // TODO: rename checkVerificationCodeForEmail - passwordlessVerificationVerifyCode(type, email, phone)

  /** Map permission from server data to local UserPermission object */
  mapUserPermission(permission: UserPermissionData): UserPermissionForChainAccount {
    if (isNullOrEmpty(permission)) return null
    const { chainNetwork, chainAccount, permission: permissionName, ...other } = permission
    return {
      ...other,
      name: permissionName,
    }
  }

  /** returns the UserPermissins a chainNetwork/chainAccount
   * if defaultOnly = true, returns the single default permission for the chainAccount
   */
  getPermissionForChainAccount(
    chainAccount: ChainAccount,
    chainNetwork: ChainNetwork,
  ): UserPermissionForChainAccount[] {
    const accountPermissions = this._userSourceData.permissions.filter(
      p => p.chainAccount === chainAccount && p.chainNetwork === chainNetwork,
    )
    return accountPermissions.map(this.mapUserPermission)
  }

  getDefaultPermissionForChainAccount(
    chainAccount: ChainAccount,
    chainNetwork: ChainNetwork,
  ): UserPermissionForChainAccount[] {
    const accountPermissions = this.getPermissionForChainAccount(chainAccount, chainNetwork)
    let defaultPermission = accountPermissions.filter(p => p.isDefault === true)
    // if no default is defined, and there is only one permission, use it as the default - this might be an external key
    if (isNullOrEmpty(defaultPermission) && accountPermissions?.length === 1) {
      defaultPermission = accountPermissions
    }
    return defaultPermission
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
    // get latest user info
    await this.getData()

    const { chainAccount, chainNetwork, permissions, walletType } = args
    if (!this.accountName || isNullOrEmpty(permissions) || isNullOrEmpty(chainNetwork)) {
      return // todo: consider if we should exit silently here - since we are called after discovery everytime, then answer is probably yes
    }

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
      const skipThisPermission = this._userSourceData.permissions.some(
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
    await this.getData()
  }
}
