import Helpers from '../utils/helpers'
import { JWTToken } from './models'
import { Observable } from '../utils/observable'

export type SubscriberAccessTokenHelper = (accessTokenHelper: AccessTokenHelper) => void

export class AccessTokenHelper extends Observable<SubscriberAccessTokenHelper> {
  constructor(accessToken?: string, ignoreIssuer = false) {
    super()
    this._ignoreIssuer = ignoreIssuer
    this.setAccessToken(accessToken)
  }

  _accessToken: string

  _accountName: string

  _decodedAccessToken: JWTToken

  _idToken: string

  _decodedIdToken: JWTToken

  _ignoreIssuer: boolean

  get accessToken() {
    return this._accessToken
  }

  get decodedAccessToken() {
    if (!this.accessToken) return null
    return this._decodedAccessToken
  }

  get idToken() {
    return this._idToken
  }

  get decodedIdToken() {
    return this._decodedIdToken
  }

  /**
   * Gets the accountName from _accountName property
   * Fallbacks to getting the accountName from the decodedAccessToken
   */
  get accountName() {
    if (!this.accessToken) return null
    if (this._accountName) return this._accountName
    AccessTokenHelper.assertIsTokenValid(this.decodedAccessToken)
    return Helpers.getClaimFromJwtTokenBySearchString(this.decodedAccessToken, 'https://oreid.aikon.com/account')
  }

  /** clear accessToken */
  clearAccessToken() {
    this.setAccessToken(null)
  }

  /** clear idToken */
  clearIdToken() {
    this.setIdToken(null)
  }

  /** Whether current accessToken is expired (or is missing)
   *  (optional) provide a Date() to compare expiration against - defaults to current Date()
   *  Returns: (boolean) true if hasExpired
   */
  hasExpired(now?: Date): boolean {
    if (!this._decodedAccessToken) return true
    if (!AccessTokenHelper.isTokenDateValidNow(this._decodedAccessToken, now)) {
      return true
    }
    return false
  }

  setAccountName(value: string) {
    if (!value) {
      this._accountName = null // allows clearing of value
    } else {
      this._accountName = value
    }
  }

  setAccessToken(value: string) {
    if (!value) {
      this._accessToken = null // allows clearing of value
    } else {
      const decodedAccessToken = Helpers.jwtDecodeSafe(value) as JWTToken
      if (!decodedAccessToken) throw Error(`Can't set accessToken. Value provided: ${value}`)
      AccessTokenHelper.assertIsTokenValid(decodedAccessToken, this._ignoreIssuer)
      AccessTokenHelper.assertIdTokenMatchesAccessToken(decodedAccessToken, this.decodedIdToken)
      this._decodedAccessToken = decodedAccessToken
      this._accessToken = value
      // Set a timer to clear the token when it expires (will clear if already expired)
      Helpers.runAtTime(() => {
        this.clearAccessToken()
        console.log('accessToken has expired and has been cleared')
      }, this._decodedAccessToken.exp * 1000)
    }
    super.callSubscribers()
  }

  setIdToken(value: string) {
    if (!value) {
      this._decodedIdToken = null // allows clearing of value
    } else {
      const decodedIdToken = Helpers.jwtDecodeSafe(value) as JWTToken
      if (!decodedIdToken) throw Error(`Can't set IdToken. Value provided: ${value}`)
      AccessTokenHelper.assertIsTokenValid(decodedIdToken, this._ignoreIssuer)
      AccessTokenHelper.assertIdTokenMatchesAccessToken(this.decodedAccessToken, decodedIdToken)
      this._decodedIdToken = decodedIdToken
      this._idToken = value
      // Set a timer to clear the token when it expires (will clear if already expired)
      Helpers.runAtTime(() => {
        this.clearIdToken()
        console.log('idToken has expired and has been cleared')
      }, this._decodedIdToken.exp * 1000)
    }
    super.callSubscribers()
  }

  /** Throws if accessToken is NOT set yet */
  assertHasAccessToken() {
    if (!this.accessToken) throw Error('AccessToken not set. Login first.')
  }

  /** Whether token is a valid OREID issued token and NOT expired */
  static isTokenValid(decodedToken: Partial<JWTToken>, ignoreIssuer = false): boolean {
    try {
      AccessTokenHelper.assertIsTokenValid(decodedToken, ignoreIssuer)
      return true
    } catch (error) {
      return false
    }
  }

  /** Throws if decodedToken is NOT a valid OREID issued token */
  static assertIsTokenValid(decodedToken: Partial<JWTToken>, ignoreIssuer = false) {
    const now = new Date()
    if (!decodedToken) throw Error('JWT (access or id) token is invalid, or expired)')
    // check if ORE ID issued this token
    if (!ignoreIssuer && !decodedToken.iss.includes('oreid.io')) {
      throw Error('Access token not issued by ORE ID')
    }
    if (!AccessTokenHelper.isTokenDateValidNow(decodedToken, now)) {
      throw Error('Access token has expired')
    }
  }

  /** Throws if accessToken does not match the same user and issuer as the idToken */
  static assertIdTokenMatchesAccessToken(decodedAccessToken: Partial<JWTToken>, decodedIdToken: Partial<JWTToken>) {
    if (!decodedAccessToken || !decodedIdToken) return
    // check if ORE ID issued this token
    if (decodedAccessToken.iss !== decodedIdToken.iss) {
      throw Error('AccessToken and IdToken mismatch - not issued by the same issuer')
    }
    if (decodedAccessToken.sub !== decodedIdToken.sub) {
      throw Error('AccessToken and IdToken mismatch - not for the same user')
    }
  }

  /** Whether a JWT token is valid for use right now - not expired and not being used before first usable date (nbf) */
  static isTokenDateValidNow(decodedToken: Partial<JWTToken>, now?: Date): boolean {
    const nowDate = now || new Date()
    const nowInMs = nowDate.getTime() / 1000
    if (typeof decodedToken.exp !== 'undefined' && decodedToken?.exp < nowInMs) {
      return false
    }
    if (typeof decodedToken?.nbf !== 'undefined' && decodedToken?.nbf > nowInMs) {
      return false
    }
    return true
  }
}
