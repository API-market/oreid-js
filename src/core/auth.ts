import OreIdContext from './IOreidContext'
import Helpers from '../utils/helpers'
import AccessTokenHelper from '../auth/accessTokenHelper'
import LocalState from '../utils/localState'
import {
  AuthResult,
  LoginOptions,
  LoginWithOreIdResult,
  LoginWithTokenOptions,
  LoginWithWalletOptions,
} from '../models'
import { providersNotImplemented } from '../constants'
import { User } from '../user'
import TransitHelper from '../transit/TransitHelper'
import { ApiLoginUserWithTokenParams, ApiMessageResult, callApiLoginUserWithToken } from '../api'
import { getOreIdAuthUrl } from './urlGenerators'

export class Auth {
  constructor(args: { oreIdContext: OreIdContext }) {
    this._oreIdContext = args.oreIdContext
    this._localState = this._oreIdContext.localState
    this._transitHelper = new TransitHelper(this._oreIdContext, this._user)
  }

  private _localState: LocalState

  private _oreIdContext: OreIdContext

  private _accessTokenHelper: AccessTokenHelper

  private _transitHelper: TransitHelper

  private _user: User

  /** User's OreID (accountName) */
  get accountName(): string {
    return this._accessTokenHelper?.accessToken ? this._accessTokenHelper?.accountName : null
  }

  get idToken() {
    return this._accessTokenHelper?.idToken
  }

  /** retrieve accessToken saved in local storage - is automatically deleted when token expires */
  get accessToken() {
    if (!this._accessTokenHelper) {
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
      this._accessTokenHelper = new AccessTokenHelper(accessToken)
    } catch (error) {
      console.log(`accessToken can't be set using: ${accessToken} `, error.message)
      return
    }
    const hasExpired = this.clearAccessTokenIfExpired()
    if (!hasExpired) {
      this._localState.saveAccessToken(accessToken)
      this._user = null
    }
  }

  /** Returns user object matching current accessToken
   *  A newly created object object won't have user.info populated, call user.getInfo() to retrieve
   */
  get user() {
    if (!this._user) {
      this._user = new User({ oreIdContext: this._oreIdContext, accessTokenHelper: this._accessTokenHelper })
    }
    return this._user
  }

  /** We have a valid access token for the current user */
  get isLoggedIn(): boolean {
    return !!this.accessToken
  }

  clearAccessTokenIfExpired(): boolean {
    const hasExpired = this._accessTokenHelper?.hasExpired()
    if (!hasExpired) return false
    // clear expired accessToken and user
    this._localState.clearAccessToken()
    this._accessTokenHelper = null
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

    return this.ConnectToWalletProvider(loginOptions)
  }

  /** Connect to the wallet provider
   *  For some wallet types, this will include an unlock and 'login' flow to select a chain account
   *  If a chainAccount is selected, it and it's associated publicKey (if available) will be saved to the user's OreId wallet as an 'external key' */
  async ConnectToWalletProvider(loginOptions: LoginWithWalletOptions) {
    const { provider } = loginOptions
    if (this._transitHelper.isTransitProvider(provider)) {
      return this._transitHelper.loginWithTransitProvider(loginOptions)
    }
    throw new Error(`Not a valid External Wallet provider: ${provider}`)
  }

  /** Call api account/login-user-with-token
   * Converts OAuth idToken from some 3rd-party source to OREID Oauth accessTokens
   * The third-party (e.g. Auth0 or Google) must be registered in the AppRegistration.oauthSettings
   * If a user does not curently exist that matches the info in the incoming idToken, a new OreID user and account is created
   * Requires a valid idToken but no accessToken or apiKey
   * Returns: OreId issued accessToken (which includes OreId account)
   * */
  async loginWithToken(loginOptions: LoginWithTokenOptions): Promise<LoginWithOreIdResult> {
    const { idToken } = loginOptions || {}
    if (!idToken) {
      throw new Error('Cant LoginWithToken - missing required parameter: idToken')
    }
    // TODO: consider allowing login with accessToken instad of idToken - along with additional user data (e.g. name, email)
    const { accessToken, error, processId } = await this.loginWithIdToken({ idToken })
    if (!error) {
      this.accessToken = accessToken // saves in cache and in local storage
      this.user.getInfo()
    }
    return { accessToken, errors: error, processId }
  }

  /** Call api account/login-user-with-token
   * Converts OAuth idToken from some 3rd-party source to OREID Oauth accessTokens
   * Requires a valid idToken but no accessToken or apiKey
   * If a user does not curently exist that matches the info in the incoming idToken, a new OreID user and account is created
   * Returns: OreId issued accessToken (which includes OreId account)
   * */
  async loginWithIdToken(
    oauthOptions: ApiLoginUserWithTokenParams,
  ): Promise<{ accessToken: string } & ApiMessageResult> {
    const accessTokenHelper = new AccessTokenHelper(oauthOptions?.idToken, true)
    if (!accessTokenHelper.decodedAccessToken) {
      return {
        accessToken: null,
        error: 'token_invalid',
        message: 'idToken invalid or corrupt',
      }
    }
    if (!AccessTokenHelper.isTokenDateValidNow(accessTokenHelper.decodedAccessToken)) {
      return {
        accessToken: null,
        error: 'token_expired',
        message: 'idToken provided is expired',
      }
    }
    const response = await callApiLoginUserWithToken(this._oreIdContext, oauthOptions)

    return {
      accessToken: response.accessToken,
      error: response?.errorCode,
      message: response?.errorMessage,
      processId: response?.processId,
    }
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
    if (accessToken) {
      this._accessTokenHelper.setAccessToken(accessToken)
    }
    if (idToken) {
      this._accessTokenHelper.setIdToken(idToken)
    }
  }
}
