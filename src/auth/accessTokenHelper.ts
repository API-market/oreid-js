import Helpers from '../utils/helpers'
import { JWTToken } from './models'

class AccessTokenHelper {
  constructor(accessToken?: string, ignoreIssuer = false) {
    this._ignoreIssuer = ignoreIssuer
    if (accessToken) {
      this.setAccessToken(accessToken)
    }
  }

  _accessToken: string

  _decodedAccessToken: JWTToken

  _idToken: string

  _decodedIdToken: JWTToken

  _ignoreIssuer: boolean

  get accessToken() {
    return this._accessToken
  }

  get decodedAccessToken() {
    this.assertHasAccessToken()
    return this._decodedAccessToken
  }

  get idToken() {
    return this._idToken
  }

  get decodedIdToken() {
    return this._decodedIdToken
  }

  get accountName() {
    this.assertHasAccessToken()
    AccessTokenHelper.assertIsTokenValid(this.decodedAccessToken)
    return Helpers.getClaimFromJwtTokenBySearchString(this.decodedAccessToken, 'https://oreid.aikon.com/account')
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

  setAccessToken(value: string) {
    // allows clearing of value
    if (!value) {
      this._accessToken = null
      return
    }
    const decodedAccessToken = Helpers.jwtDecodeSafe(value) as JWTToken
    if (!decodedAccessToken) throw Error(`Can't set accessToken. Value provided: ${value}`)
    AccessTokenHelper.assertIsTokenValid(decodedAccessToken, this._ignoreIssuer)
    AccessTokenHelper.assertIdTokenMatchesAccessToken(decodedAccessToken, this.decodedIdToken)
    this._decodedAccessToken = decodedAccessToken
    this._accessToken = value
  }

  setIdToken(value: string) {
    const decodedIdToken = Helpers.jwtDecodeSafe(value) as JWTToken
    if (!decodedIdToken) throw Error(`Can't set IdToken. Value provided: ${value}`)
    AccessTokenHelper.assertIsTokenValid(decodedIdToken, this._ignoreIssuer)
    AccessTokenHelper.assertIdTokenMatchesAccessToken(this.decodedAccessToken, decodedIdToken)
    this._decodedIdToken = decodedIdToken
    this._idToken = value
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
    if (!decodedToken) throw Error('JWT (access or id) token is invalid, or expired)')
    // check if ORE ID issued this token
    if (!ignoreIssuer && !decodedToken.iss.includes('oreid.io')) {
      throw Error('Access token not issued by ORE ID')
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

export default AccessTokenHelper
