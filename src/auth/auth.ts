import OreIdContext from '../core/IOreidContext'
import Helpers from '../utils/helpers'
import AccessTokenHelper from './accessTokenHelper'
import LocalState from '../utils/localState'
import {
  AuthResult,
  LoginOptions,
  LoginWithOreIdResult,
  LoginWithTokenOptions,
  LoginWithWalletOptions,
} from '../models'
import { providersNotImplemented } from '../constants'
import User from '../user/user'
import TransitHelper from '../transit/TransitHelper'
import {
  ApiConvertOauthTokensParams,
  ApiLoginUserWithTokenParams,
  ApiNewUserWithTokenParams,
  ApiMessageResult,
  callApiConvertOauthTokens,
  callApiLoginUserWithToken,
  callApiNewUserWithToken,
} from '../api'
import { getOreIdAuthUrl } from '../core/urlGenerators'
import { NewUserWithTokenOptions } from './models'

export default class Auth {
  constructor(args: { oreIdContext: OreIdContext }) {
    this._oreIdContext = args.oreIdContext
    this._localState = this._oreIdContext.localState
    this._transitHelper = new TransitHelper({ oreIdContext: this._oreIdContext, user: this._user })
    this._accessTokenHelper = new AccessTokenHelper()
  }

  private _accessTokenHelper: AccessTokenHelper

  private _localState: LocalState

  private _oreIdContext: OreIdContext

  private _transitHelper: TransitHelper

  private _user: User

  /** User's OreID (accountName) */
  get accessTokenHelper(): AccessTokenHelper {
    return this._accessTokenHelper
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
    if (!this._accessTokenHelper.accessToken) {
      const savedToken = this._localState?.accessToken
      if (!savedToken) return null
      this.accessToken = savedToken // sets accessTokenHelper
    }
    const hasExpired = this.clearAccessTokenIfExpired()
    if (hasExpired) return null
    return this._accessTokenHelper?.accessToken
  }

  /** Sets the access token in local storage (and in accessTokenHelper)
   * this token will be used to call ORE ID APIs (on behalf of the user)
   * This token is user-specific - call logout to clear it upon user log-out
   * For an expired token, this function will delete the accessToken (and matching user) from local storage
   * NOTE: This function will be called automatically if you use handleAuthCallback() */
  set accessToken(accessToken: string) {
    try {
      // decodes and validates accessToken is a valid token
      this._accessTokenHelper.setAccessToken(accessToken)
    } catch (error) {
      console.log(`accessToken can't be set using: ${accessToken} `, error.message)
      return
    }
    const hasExpired = this.clearAccessTokenIfExpired()
    if (!hasExpired) {
      this._localState.saveAccessToken(accessToken)
    }
    this._user = null
  }

  /** Returns user object matching current accessToken
   *  A newly created object object won't have user.info populated, call user.getInfo() to retrieve
   */
  get user() {
    if (!this._user) {
      this._user = new User({
        oreIdContext: this._oreIdContext,
        getAccessToken: this.accessToken, // accessToken getter
        getAccountName: this.accountName, // accountName getter
      })
    }
    return this._user
  }

  /** We have a valid access token for the current user */
  get isLoggedIn(): boolean {
    return !!this.accessToken
  }

  private clearAccessToken() {
    // clear accessToken and user
    this._localState.clearAccessToken()
    this._accessTokenHelper.setAccessToken(null)
  }

  private clearAccessTokenIfExpired(): boolean {
    const hasExpired = this._accessTokenHelper?.hasExpired()
    if (!hasExpired) return false
    // clear expired accessToken and user
    this.clearAccessToken()
    console.log('accessToken has expired and has been cleared')
    return true
  }

  /** Calls the 'connect' function on a external wallet (e.g. Metamask)
   *  For most, however, this function returns the chainAccount selected by the user in the wallet app
   *  Different wallets have different behavior. Some do not support this feature. */
  async connectWithWallet(loginOptions: LoginWithWalletOptions) {
    const { provider } = loginOptions

    if (!this._transitHelper.isTransitProvider(provider) || providersNotImplemented.includes(provider)) {
      throw new Error(`loginWithWallet not supprted for provider: ${provider}`)
    }

    return this.connectToWalletProvider(loginOptions)
  }

  /** Connect to the wallet provider
   *  For some wallet types, this will include an unlock and 'login' flow to select a chain account
   *  If a chainAccount is selected, it and it's associated publicKey (if available) will be saved to the user's OreId wallet as an 'external key' */
  private async connectToWalletProvider(loginOptions: LoginWithWalletOptions) {
    const { provider } = loginOptions
    if (this._transitHelper.isTransitProvider(provider)) {
      return this._transitHelper.loginWithTransitProvider(loginOptions)
    }
    throw new Error(`Not a valid External Wallet provider: ${provider}`)
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
      this.user.getInfo()
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
      this.user.getInfo()
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
    this.setAuthResult({ accessToken: response?.accessToken })
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
    this.setAuthResult({ accessToken: response?.accessToken })
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

    this.setAuthResult(response)
    // clear the busy indicator now that we've finsihed the auth flow
    this._oreIdContext.setIsBusy(false)
    return response
  }

  /** store response from auth flow (accountName, accessToken, idToken) in localState */
  setAuthResult(authResponse: AuthResult) {
    const { accessToken, idToken } = authResponse
    if (!accessToken) throw Error('Cant setAuthResult. accessToken is missing')
    this._accessTokenHelper.setAccessToken(accessToken)

    if (idToken) {
      this._accessTokenHelper.setIdToken(idToken)
    }
  }
}
