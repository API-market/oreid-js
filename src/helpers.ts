/*
    helper functions
 */
// import jwtdecode from 'jwt-decode'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { JWTToken } from './types'

const { Base64 } = require('js-base64')

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
      console.log(message, data)
    }
  }

  // if signingCert is provided, will verify that jwt is signed with the same cert (valid signature)
  // ...otherwise, we'll just decode the jwt and not check the signature
  static jwtDecodeSafe(token: string, signingCert?: string): Partial<JWTToken> {
    let decoded: JWTToken
    if (this.isNullOrEmpty(token)) {
      return {}
    }
    try {
      if (signingCert) {
        decoded = jwt.verify(token, signingCert) as JWTToken
      } else {
        decoded = jwt.decode(token) as JWTToken
      }
    } catch (error) {
      // throw Error(`Problem decoding or validating JWT token: ${token} error:${error}`)
    }
    return decoded
  }

  static tokenHasExpired(token: string) {
    let decoded: Partial<JWTToken>
    try {
      decoded = this.jwtDecodeSafe(token) || {}
    } catch (error) {
      return true
    }

    const now = Date.now().valueOf() / 1000
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
      return true
    }
    if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
      return true
    }
    return false
  }

  static urlParamsToArray(fullpathIn: string) {
    let fullpath = fullpathIn
    let firstItemIndex = 1 // skip the first parsed item by default (usually the server name)
    if (this.isNullOrEmpty(fullpath)) {
      return []
    }

    // Grab everything after hash if it exists
    if (fullpath.includes('#')) {
      fullpath = fullpath.substring(fullpath.indexOf('#') + 1)
      firstItemIndex = 0 // server name is pruned now
    }

    const parts = fullpath.split(/[/?/$&]/)

    // Everything else delimited by '/' or ',' or '&' or '?' is a parameter
    let params: string[] = []
    if (parts.length > 0) {
      params = parts.slice(firstItemIndex)
    }

    // paramPairs  e.g. [ ['enabled'], [ 'abc', '123' ], [ 'dbc', '444' ] ]   -- if the parameter only has a name and no value, the value is set to true
    const paramPairs = params.map(param => param.split('='))
    const jsonParams: { [key: string]: any } = {}
    // convert array to json object e.g. { enabled: true, abc: '123', dbc: '444' }
    paramPairs.forEach(pair => {
      jsonParams[pair[0]] = decodeURIComponent(pair[1]) || true
    })
    return jsonParams
  }

  // Returns Null if parse fails
  static tryParseJSON(jsonStringIn: any, unescape?: boolean) {
    let jsonString = jsonStringIn

    if (!jsonString) {
      return null
    }
    let doubleQuotes = ''
    try {
      if (unescape) {
        jsonString = decodeURI(jsonString)
      }
      // eslint-disable-next-line quotes
      doubleQuotes = replaceAll(jsonString, "'", '"')
      doubleQuotes = replaceAll(doubleQuotes, '`', '"')
      const o = JSON.parse(doubleQuotes)
      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object",
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (o && typeof o === 'object') {
        return o
      }
    } catch (error) {
      console.log(error)
    }

    return null
  }

  static isAnObject(obj: any) {
    return obj !== null && typeof obj === 'object'
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

  // if an Object or JSON is passed-in, it will be stringified first
  static base64Encode(valueIn: any) {
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

  /** Call the callback once for each item in the array and await for each to finish in turn */
  static async asyncForEach(array: any[], callback: (item: any, index: number, array: any[]) => Promise<any>) {
    for (let index = 0; index < array.length; index += 1) {
      // eslint-disable-next-line @typescript-eslint/semi
      // eslint-disable-next-line no-await-in-loop
      await callback(array[index], index, array)
    }
  }
}
