/*
    helper functions
 */
import { AxiosError } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import canonicalize from 'canonicalize'
import jwtDecode from 'jwt-decode'
import { Base64 } from 'js-base64'
import { JWTToken } from '../auth/models'
import { AuthProvider, ExternalWalletType, JSONObject, Lookup } from '../common/models'

const TRACING = false // enable when debugging to see detailed outputs

// split a string or array at a given index position
export const splitAt = (index: number, dropChars: number) => (x: string) => [
  x.slice(0, index),
  x.slice(index + dropChars),
]

const replaceAll = (inString: string, search: string, replacement: string) => {
  return inString.replace(new RegExp(search, 'g'), replacement)
}

export default class Helpers {
  static isInBrowser = typeof window !== 'undefined'

  static isNullOrEmpty(obj: any) {
    if (obj === undefined) {
      return true
    }
    if (obj === null) {
      return true
    }
    // Check for an empty array too
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return true
      }
    }
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }

  // log data
  static log(message: string, data?: any) {
    if (TRACING) {
      // eslint-disable-next-line no-console
      console.log(message, data)
    }
  }

  /** Decodes a JWT token string
   *  If token can't be decoded (e.g. corrupted), returns null */
  static jwtDecodeSafe(token: string): Partial<JWTToken> {
    let decoded: JWTToken
    if (this.isNullOrEmpty(token)) {
      return null
    }
    try {
      decoded = jwtDecode(token) as JWTToken
    } catch (error) {
      // throw Error(`Problem decoding or validating JWT token: ${token} error:${error}`)
    }
    return decoded
  }

  /**  Takes a url string and converts it to an object of {paramNane, paramValue}
   * e.g input: https://xxx?enabled&name=value&name2=val2
   *   returns: { 'enabled': true, 'name':'value', 'name2':'val2' }
   * if the parameter only has a name and no value, then its value is set to 'true'
   * */
  static parseUrlParams(fullPath: string) {
    const urlParamsObject: JSONObject = {}
    let searchString
    try {
      const urlObject = new URL(fullPath)
      if (urlObject.hash) {
        searchString = urlObject.hash.slice(1) // remove #
      } else {
        searchString = urlObject.search
      }
    } catch (error) {
      searchString = fullPath // treat as partial url string E.g. '?param1=value1...'
    }

    const urlParams = new URLSearchParams(searchString)
    urlParams.forEach((value, key) => {
      urlParamsObject[key] = decodeURIComponent(value) || 'true'
    })

    return urlParamsObject
  }

  /** Returns Null if parse fails
   *  Reinflates a serialized object (e.g. UInt8Array) if found in JSON
   */
  static tryParseJSON(jsonString: any, unescape = false, replaceQuotes = false) {
    let finalJsonString = ''
    if (!jsonString || !Helpers.isAString(jsonString) || jsonString.trim() === '') return null
    try {
      if (unescape) {
        // eslint-disable-next-line no-param-reassign
        jsonString = decodeURI(jsonString)
      }
      finalJsonString = jsonString
      if (replaceQuotes) {
        // eslint-disable-next-line quotes
        finalJsonString = replaceAll(jsonString, "'", '"')
        finalJsonString = replaceAll(finalJsonString, '`', '"')
      }
      const o = JSON.parse(finalJsonString, Helpers.jsonParseComplexObjectReviver)
      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object",
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (o && typeof o === 'object') {
        return o
      }
    } catch (error) {
      // TODO: should log trace this detail: ('error parsing JSON', { jsonString, doubleQuotes, error });
    }

    return null
  }

  /**
   * The reviver function passed into JSON.parse to implement custom type conversions.
   * If the value is a previously stringified buffer we convert it to a Buffer,
   * If its an object of numbers, we convert to UInt8Array {"0":2,"1":209,"2":8 ...}
   * otherwise return the value
   */
  static jsonParseComplexObjectReviver(key: string, value: any) {
    // Convert Buffer
    if (
      value !== null &&
      typeof value === 'object' &&
      'type' in value &&
      value.type === 'Buffer' &&
      'data' in value &&
      Array.isArray(value.data)
    ) {
      return Buffer.from(value.data)
    }

    // Convert number array to UInt8Array e.g. {"0":2,"1":209,"2":8 ...}
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      '0' in value &&
      Helpers.isANumber(value['0'])
    ) {
      const values = Object.entries(value).map(([, val]) => val)
      // if array only has 8-bit numbers, convert it to UInt8Array
      if (values.every(val => Helpers.isANumber(val) || val < 256)) {
        return new Uint8Array(values as number[])
      }
    }

    // Return parsed value without modifying
    return value
  }

  static base64DecodeSafe(encodedString: string) {
    let decoded: any = {}
    if (this.isNullOrEmpty(encodedString)) {
      return null
    }
    try {
      decoded = Base64.decode(encodedString)
      // if decoded value is a stringified JSON object, return the object
      if (Helpers.tryParseJSON(decoded)) {
        decoded = JSON.parse(decoded)
      }
    } catch (error) {
      // logError('Problem decoding base64DecodeSafe:',error);
      return null
    }
    return decoded
  }

  /**  Base64 encodes a string
   * if value passed in is an Object or JSON, it will be stringified first
   * if value is null, this function returns null */
  static base64Encode(valueIn: any) {
    if (!valueIn) return null
    let value = valueIn
    if (Helpers.isAnObject(value)) {
      value = JSON.stringify(value)
    }
    return Base64.encode(value)
  }

  static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static createGuid() {
    return uuidv4()
  }

  /** Typescript Typeguard to verify that the value is in the enumType specified  */
  static isInEnum<T>(enumType: T, value: any): value is T[keyof T] {
    return Object.values(enumType).includes(value as T[keyof T])
  }

  /** Typescript Typeguard helper to ensure that a string value can be assigned to an Enum type
   *  If a value can't be matched to a valid option in the enum, returns null (or throws if throwIfInvalid = true) */
  static toEnumValue<T>(e: T, value: any, throwIfInvalid = false): T[keyof T] {
    if (this.isNullOrEmpty(value)) return null
    if (this.isInEnum<T>(e, value)) {
      return value
    }
    const errMsg = `Value ${JSON.stringify(value)} is not a valid member of enum ${JSON.stringify(e)}.`
    if (throwIfInvalid) {
      throw new Error(errMsg)
    }
    return null
  }

  /** Parses comma-seperated error_codes from url response
   * Returns: array of error code strings
   * Note: Params is a javascript object parsed from callback URL string */
  static getErrorCodesFromParams(params: any) {
    let errorCodes: string[]
    const errorString = params.error_code || params.errorCode
    const errorMessage = params.error_message || params.errorMessage
    if (errorString) {
      errorCodes = errorString.split(/[/?/$&]/)
    }
    if (errorCodes || errorMessage) {
      errorCodes = errorCodes || []
      errorCodes.push(errorMessage)
    }
    return errorCodes
  }

  /** Retrieve values from a url query string and returns an array of them
   *  Also parses error codes returned into an array of errors codes/messages
   */
  static extractDataFromCallbackUrl(url: string) {
    let params: { [key: string]: any } = {}
    if (url) {
      params = this.parseUrlParams(url)
      const errors = this.getErrorCodesFromParams(params)
      return { ...params, errors }
    }
    return params
  }

  /** Call the callback once for each item in the array and await for each to finish in turn */
  static async asyncForEach(array: any[], callback: (item: any, index: number, array: any[]) => Promise<any>) {
    for (let index = 0; index < array.length; index += 1) {
      // eslint-disable-next-line @typescript-eslint/semi
      // eslint-disable-next-line no-await-in-loop
      await callback(array[index], index, array)
    }
  }

  /** Return a value in a custom claim in a JWT token by using a partial claim name
   *  e.g. function(token, 'appId') => value for claim https://oreid.io/appId */
  static getClaimFromJwtTokenBySearchString(decodedToken: JWTToken, searchString: string) {
    let value: string
    if (!this.isAnObject(decodedToken)) return null
    // loop through items in token to find matching string
    Object.keys(decodedToken).forEach(item => {
      if (item.includes(searchString)) {
        value = (decodedToken as Lookup)[item]
      }
    })
    return value
  }

  /** get error from inside a network request (Axios Error object) and return it */
  static getErrorFromAxiosError(error: AxiosError) {
    // Browser thre an error during CORS preflight post - See https://github.com/axios/axios/issues/1143
    if (error?.message.toLowerCase() === 'network error') {
      throw new Error(
        'Browser threw a Network Error. This is likely because of CORS error. Make sure that you are not sending an api-key in the header of the request.',
      )
    }
    if (!Helpers.isAxiosError(error)) {
      return error
    }
    // extract error message from Axios Error and return new Error
    const { data = {} } = error?.response || {}
    const { message } = data
    const errorCodes = this.getErrorCodesFromParams(data)
    // oreid apis pass back errorCode/errorMessages
    // also handle when a standard error message is thrown
    const errorCodesList = errorCodes && errorCodes?.length > 1 ? errorCodes.join(', ') : errorCodes
    const errorString = errorCodesList || message || 'unknown error'
    return Error(errorString)
  }

  static isAxiosError(error: any): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined
  }

  static isAString(value: any): boolean {
    if (!value) {
      return false
    }
    return typeof value === 'string' || value instanceof String
  }

  static isADate(value: any): boolean {
    return value instanceof Date
  }

  static isABoolean(value: any): boolean {
    return typeof value === 'boolean' || value instanceof Boolean
  }

  static isANumber(value: any): boolean {
    if (Number.isNaN(value)) return false
    return typeof value === 'number' || value instanceof Number
  }

  static isAnObject(obj: any): boolean {
    return obj !== null && typeof obj === 'object'
  }

  /** throw error if invalid provider */
  static assertValidProvider(provider: AuthProvider) {
    if (Helpers.isInEnum(AuthProvider, provider)) {
      return true
    }
    throw new Error(`Auth provider ${provider} is not a valid option`)
  }

  /** Convert an AuthProvider to the ExternalWalletType subset
   *  Returns null if can't convert member */
  static mapAuthProviderToWalletType(provider: AuthProvider | ExternalWalletType) {
    if (!provider) return null
    return Helpers.toEnumValue(ExternalWalletType, provider)
  }

  static isCustodial(provider: AuthProvider) {
    return provider === AuthProvider.Custodial
  }

  static isValidEmail(email: any): boolean {
    if (!email) return false
    const emailRegex = /^(([^<>()[]\\.,;:\s@]+(\.[^<>()[]\\.,;:\s@]+)*)|(.+))@(([[0-9]{1,3}\[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegex.test(email)
  }

  /** Sort JSON in a deterministic way */
  static sortJson(value: any): any {
    if (!value) return value
    const stringified = canonicalize(value)
    return JSON.parse(stringified)
  }
}
