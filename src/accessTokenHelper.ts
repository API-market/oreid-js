import Helpers from './helpers'
import { JWTToken } from './models'

class AccessTokenHelper {
  constructor(accessToken: string, ignoreIssuer = false) {
    this._ignoreIssuer = ignoreIssuer
    this.setAccessToken(accessToken)
  }

  _accessToken: string

  _decodedToken: JWTToken

  _ignoreIssuer: boolean

  get accessToken() {
    return this._accessToken
  }

  get decodedToken() {
    return this._decodedToken
  }

  get accountName() {
    AccessTokenHelper.assertIsTokenValid(this.decodedToken)
    return Helpers.getClaimFromJwtTokenBySearchString(this.decodedToken, 'https://oreid.aikon.com/account')
  }

  /** Whether current accessToken is expired
   *  (optional) provide a Date() to compare expiration against - defaults to current Date()
   *  Returns: (boolean) true if hasExpired
   */
  hasExpired(now?: Date): boolean {
    if (!this._decodedToken) return false
    if (!AccessTokenHelper.isTokenDateValidNow(this._decodedToken, now)) {
      return true
    }
    return false
  }

  setAccessToken(value: string) {
    const decodedAccessToken = Helpers.jwtDecodeSafe(value) as JWTToken
    if (!decodedAccessToken) throw Error(`Can't set AccessToken - not a valid JWT string. Value provided: ${value}`)
    AccessTokenHelper.assertIsTokenValid(decodedAccessToken, this._ignoreIssuer)
    this._decodedToken = decodedAccessToken
    this._accessToken = value
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
    if (!decodedToken) throw Error('AccessToken is invalid, or expired)')
    // check if ORE ID issued this token
    if (!ignoreIssuer && !decodedToken.iss.includes('oreid.io')) {
      throw Error('Access token not issued by ORE ID')
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
