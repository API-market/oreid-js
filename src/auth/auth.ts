import {
  ApiConvertOauthTokensParams,
  ApiLoginUserWithTokenParams,
  ApiMessageResult,
  ApiNewUserWithTokenParams,
  callApiConvertOauthTokens,
  callApiLoginUserWithToken,
  callApiNewUserWithToken,
} from '../api'
import OreIdContext from '../core/IOreidContext'
import { getOreIdAuthUrl } from '../core/urlGenerators'
import TransitHelper from '../transit/TransitHelper'
import UalHelper from '../ual/UalHelper'
import { User } from '../user/user'
import Helpers from '../utils/helpers'
import LocalState from '../utils/localState'
import { Observable } from '../utils/observable'
import { AccessTokenHelper } from './accessTokenHelper'
import { AuthResult, LoginWithOreIdResult } from '../core/models'
import { LoginOptions, LoginWithTokenOptions, LoginWithWalletOptions, NewUserWithTokenOptions } from './models'

export type SubscriberAuth = (auth: Auth) => void

export class Auth extends Observable<SubscriberAuth> {
  constructor(args: { oreIdContext: OreIdContext }) {
    super()
    this._oreIdContext = args.oreIdContext
    this._localState = this._oreIdContext.localState
    this._transitHelper = new TransitHelper({ oreIdContext: this._oreIdContext, user: this._user })
    this._ualHelper = new UalHelper({ oreIdContext: this._oreIdContext, user: this._user })
    this.initAccessTokenHelper()
  }

  private _accessTokenHelper: AccessTokenHelper

  private _localState: LocalState

  private _oreIdContext: OreIdContext

  private _transitHelper: TransitHelper

  private _ualHelper: UalHelper

  private _user: User

  /** User's OreID (accountName) */
  get accessTokenHelper(): AccessTokenHelper {
    return this._accessTokenHelper
  }

  private initAccessTokenHelper() {
    this._accessTokenHelper = new AccessTokenHelper()
    const savedToken = this._localState?.accessToken
    this.accessToken = savedToken
    this.saveAccessTokenAndNotifySubscribers(savedToken) // if savedToken is expired, it will be not set here
    // listen for future changes to accessTokenHelper
    this._accessTokenHelper.subscribe(this.onUpdateAccessTokenHelper)
  }

  /** User's OreID (accountName) */
  get accountName(): string {
    return this._accessTokenHelper?.accessToken ? this._accessTokenHelper?.accountName : null
  }

  get idToken() {
    return this._accessTokenHelper?.idToken
  }

  /** retrieve accessToken saved in local storage - is automatically deleted when token expires */
  get accessToken() {
    return this._accessTokenHelper?.accessToken
  }

  /** Sets the access token in local storage (and in accessTokenHelper)
   * this token will be used to call ORE ID APIs (on behalf of the user)
   * This token is user-specific - call logout to clear it upon user log-out
   * When the accessToken token expires, it will be deleted from local storage and user will be cleared
   */
  set accessToken(accessToken: string) {
    try {
      // decodes and validates accessToken is a valid token
      // if incoming token has expired, _accessTokenHelper will throw (and token wont be saved)
      this._accessTokenHelper.setAccessToken(accessToken)
      // NOTE: We dont save the access token to local storage here as that will happen when onUpdateAccessTokenHelper is called
    } catch (error) {
      console.log('Cant set accessToken.', error.message)
    }
  }

  /** set private variable and save to localState
   * NOTE: This is called every time this._accessTokenHelper.accessToken changes (or expires)
   */
  private saveAccessTokenAndNotifySubscribers(accessToken: string) {
    if (this._localState?.accessToken !== accessToken) {
      this._localState.saveAccessToken(accessToken)
      this._user = null
    }
    super.callSubscribers()
  }

  /** Returns user object matching current accessToken
   *  A newly created object object won't have user.info populated, call user.getData() to retrieve
   */
  get user() {
    if (!this._user) {
      this._user = new User({
        oreIdContext: this._oreIdContext,
        accessTokenHelper: this._accessTokenHelper, // accessToken helper
        accountName: this.accountName, // accountName
      })
    }
    return this._user
  }

  /** We have a valid access token for the current user */
  get isLoggedIn(): boolean {
    return !!this.accessToken
  }

  /** runs when accessTokenHelper changes */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onUpdateAccessTokenHelper = (newAccessTokenHelper: AccessTokenHelper) => {
    // save new access token
    this.saveAccessTokenAndNotifySubscribers(this._accessTokenHelper.accessToken)
  }

  private clearAccessToken() {
    // clear accessToken and user
    this._localState.clearAccessToken()
    this._accessTokenHelper.clearAccessToken()
    super.callSubscribers()
  }

  /** Calls the 'connect' function on a external wallet (e.g. Metamask)
   *  For most, however, this function returns the chainAccount selected by the user in the wallet app
   *  Different wallets have different behavior. Some do not support this feature. */
  async connectWithWallet(loginOptions: LoginWithWalletOptions) {
    const { walletType } = loginOptions

    if (!this._oreIdContext.walletHelper.isAValidExternalWalletType(walletType)) {
      throw new Error(`loginWithWallet not supported for external wallet type: ${walletType}`)
    }

    return this.connectToWalletProvider(loginOptions)
  }

  /** Connect to the wallet provider
   *  For some wallet types, this will include an unlock and 'login' flow to select a chain account
   *  If a chainAccount is selected, it and it's associated publicKey (if available) will be saved to the user's OreId wallet as an 'external key' */
  private async connectToWalletProvider(loginOptions: LoginWithWalletOptions) {
    return this._oreIdContext.walletHelper.connectToWalletProvider(loginOptions)
  }

  /** Calls the account/convert-oauth api
   * Converts OAuth tokens from some 3rd-party source to OREID Oauth tokens
   * The third-party (e.g. Auth0 or Google) must be registered in the AppRegistration.oauthSettings
   * Returns: OreId issued accessToken and idToken
   * */
  private async convertOauthTokens(oauthOptions: ApiConvertOauthTokensParams) {
    return callApiConvertOauthTokens(this._oreIdContext, oauthOptions)
  }

  /**
   * Converts OAuth accessToken or idToken from some 3rd-party source (e.g. Google) to OreId OAuth accessToken
   * The third-party (e.g. Auth0 or Google) must be registered in the App Registration's oauthSettings
   * If a user does not curently exist that matches the info in the incoming idToken, an error is thrown
   * Does not requires a user to be logged-in (no current accessToken) or apiKey
   * Returns: OreId issued accessToken
   * */
  async loginWithToken(loginOptions: LoginWithTokenOptions): Promise<LoginWithOreIdResult> {
    if (!loginOptions?.idToken && !loginOptions?.accessToken) {
      throw new Error('Cant loginWithToken - missing required parameter: accessToken OR idToken')
    }
    const { accessToken, error, processId } = await this.loginWithJwtToken(loginOptions)
    if (!error) {
      this.accessToken = accessToken // saves in cache and in local storage
      this.user.getData()
    }
    return { accessToken, errors: error, processId }
  }

  /** Converts OAuth idToken from some 3rd-party source to OREID Oauth accessTokens
   * The third-party (e.g. Auth0 or Google) must be registered in the AppRegistration.oauthSettings
   * Creates a new OreId user and account from info in the incoming idToken
   * If a matching user already exist, and error is returned
   * Requires a valid idToken but no current accessToken or apiKey
   * Returns: OreId issued accessToken
   * */
  async newUserWithToken(loginOptions: NewUserWithTokenOptions): Promise<LoginWithOreIdResult> {
    const { idToken } = loginOptions || {}
    if (!idToken) {
      throw new Error('Cant do newUserWithToken - missing required parameter: idToken')
    }
    const { accessToken, error, processId } = await this.newAccountWithIdToken({ idToken })
    if (!error) {
      this.accessToken = accessToken // saves in cache and in local storage
      this.user.getData()
    }
    return { accessToken, errors: error, processId }
  }

  /** Calls api account/login-user-with-token for loginWithToken() (after checking for valid token */
  private checkJwtTokenAndReturnError(jwtTokenString: string): { error?: string; message?: string } {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const accessTokenHelper = new AccessTokenHelper(jwtTokenString, true)
    } catch (error) {
      return {
        error: 'token_invalid',
        message: 'token invalid or corrupt - must be a JWT Oauth2 token',
      }
    }

    return null
  }

  /** Calls api account/login-user-with-token for loginWithToken() (after checking for valid token */
  private async loginWithJwtToken(
    oauthOptions: ApiLoginUserWithTokenParams,
  ): Promise<{ accessToken: string } & ApiMessageResult> {
    const { accessToken, idToken } = oauthOptions
    // check valid idToken
    let tokenCheckError = accessToken ? this.checkJwtTokenAndReturnError(accessToken) : null
    if (tokenCheckError) return { accessToken: null, ...tokenCheckError }
    // check valid accessToken
    tokenCheckError = idToken ? this.checkJwtTokenAndReturnError(idToken) : null
    if (tokenCheckError) return { accessToken: null, ...tokenCheckError }

    const response = await callApiLoginUserWithToken(this._oreIdContext, oauthOptions)
    if (!response?.errorCode) {
      this.setAuthResult({ accessToken: response?.accessToken })
    }
    return {
      accessToken: response.accessToken,
      error: response?.errorCode,
      message: response?.errorMessage,
      processId: response?.processId,
    }
  }

  /** Calls api account/new-user-with-token for newUserWithToken() (after checking for valid token */
  private async newAccountWithIdToken(
    oauthOptions: ApiNewUserWithTokenParams,
  ): Promise<{ accessToken: string } & ApiMessageResult> {
    const { idToken } = oauthOptions
    // check valid ifToken
    const tokenCheckError = idToken ? this.checkJwtTokenAndReturnError(idToken) : null
    if (tokenCheckError) return { accessToken: null, ...tokenCheckError }

    const response = await callApiNewUserWithToken(this._oreIdContext, oauthOptions)
    if (!response?.errorCode) {
      this.setAuthResult({ accessToken: response?.accessToken })
    }
    return {
      accessToken: response.accessToken,
      error: response?.errorCode,
      message: response?.errorMessage,
      processId: response?.processId,
    }
  }

  /** clear accessToken and user */
  logout() {
    this.clearAccessToken()
    this._user = null
  }

  /** Returns a fully formed url to redirect the user's browser to login using ORE ID
   *  This function calls the /auth web endpoint
   *  Returns: Callback returns account, and optionally accessToken and/or idToken for user */
  async getLoginUrl(loginOptions: LoginOptions): Promise<LoginWithOreIdResult> {
    const { code, email, idToken, phone, provider, state, linkToAccount, returnAccessToken, returnIdToken } =
      loginOptions || {}
    const { authCallbackUrl, backgroundColor } = this._oreIdContext.options
    const args = {
      code,
      email,
      idToken,
      phone,
      provider,
      backgroundColor,
      callbackUrl: authCallbackUrl,
      state,
      linkToAccount,
      returnAccessToken: Helpers.isNullOrEmpty(returnAccessToken) ? true : returnAccessToken, // if returnAccessToken not specified, default to true
      returnIdToken,
    }
    const loginUrl = await getOreIdAuthUrl(this._oreIdContext, args)
    return { loginUrl, errors: null }
  }

  /** Extracts and returns the response parameters on the /auth callback URL string
   *  Applies accessToken and idToken (if included on the url) to local state
   */
  handleAuthCallback(callbackUrlString: string): AuthResult {
    // Parses error codes and returns an errors array
    // (if there is an error_code param sent back - can have more than one error code - seperated by a ‘&’ delimeter
    const {
      access_token: accessToken,
      account,
      id_token: idToken,
      errors,
      process_id: processId,
      state,
    } = Helpers.extractDataFromCallbackUrl(callbackUrlString)
    const response: AuthResult = { account }

    if (errors) response.errors = errors
    if (processId) response.processId = processId
    if (state) response.state = state
    if (accessToken) response.accessToken = accessToken
    if (idToken) response.idToken = idToken

    if (!errors) {
      this.setAuthResult(response)
    }

    // clear the busy indicator now that we've finsihed the auth flow
    this._oreIdContext.setIsBusy(false)
    return response
  }

  /** store response from auth flow (accountName, accessToken, idToken) in localState */
  setAuthResult(authResponse: AuthResult) {
    const { accessToken, idToken } = authResponse
    if (!accessToken) throw Error('Cant setAuthResult. accessToken is missing')
    if (idToken) this._accessTokenHelper.setIdToken(null) // clear the existing idToken first (so set accessToken wont throw a mismatch when set)
    this.accessToken = accessToken // saves the token to localstorage
    if (idToken) {
      this._accessTokenHelper.setIdToken(idToken)
    }
  }
}
