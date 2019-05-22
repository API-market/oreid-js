/*
    helper functions
 */
import jwtdecode from 'jwt-decode';

const Base64 = require('js-base64').Base64;

const TRACING = false; // enable when debugging to see detailed outputs

// split a string or array at a given index position
const splitAt = (index, dropChars) => (x) => [x.slice(0, index), x.slice(index + dropChars)];

const replaceAll = (inString, search, replacement) => {
  return inString.replace(new RegExp(search, 'g'), replacement);
};

export default class Helpers {
  static isNullOrEmpty(obj) {
    if (obj === undefined) {
      return true;
    }
    if (obj === null) {
      return true;
    }
    // Check for an empty array too
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return true;
      }
    }
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  // log data
  static log(message, data) {
    if (TRACING) {
      console.log(message, data);
    }
  }

  static jwtDecodeSafe(token) {
    let decoded = {};
    if (this.isNullOrEmpty(token)) {
      return {};
    }
    try {
      decoded = jwtdecode(token);
    } catch (error) {
      // logError('Problem decoding token:',token);
    }
    return decoded;
  }

  static tokenHasExpired(token) {
    let decoded = null;
    try {
      decoded = this.jwtDecodeSafe(token);
    } catch (error) {
      return true;
    }

    const now = Date.now().valueOf() / 1000;
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
      return true;
    }
    if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
      return true;
    }
    return false;
  }

  static urlParamsToArray(fullpathIn) {
    let fullpath = fullpathIn;

    if (this.isNullOrEmpty(fullpath)) {
      return [];
    }

    // Grab everything after hash if it exists
    if (fullpath.includes('?')) {
      fullpath = fullpath.split('?')[1];
    }

    const parts = fullpath.split(/[/?/$&]/);

    // Everything else delimited by '/' or ',' or '&' or '?' is a parameter
    let params = [];
    if (parts.length > 0) {
      params = parts.slice(0);
    }
    // paramPairs  e.g. [ ['enabled'], [ 'abc', '123' ], [ 'dbc', '444' ] ]   -- if the parameter only has a name and no value, the value is set to true
    const paramPairs = params.map((param) => splitAt(param.search(/[=]/), 1)(param)); // split at first '='

    const jsonParams = {};
    // convert array to json object e.g. { enabled: true, abc: '123', dbc: '444' }
    paramPairs.forEach((pair) => {
      jsonParams[pair[0]] = decodeURIComponent(pair[1]) || true;
    });
    return jsonParams;
  }

  // Returns Null if parse fails
  static tryParseJSON(jsonStringIn, unescape) {
    let jsonString = jsonStringIn;

    if (!jsonString) {
      return null;
    }
    let doubleQuotes = '';
    try {
      if (unescape) {
        jsonString = decodeURI(jsonString);
      }
      doubleQuotes = replaceAll(jsonString, "'", '"');
      doubleQuotes = replaceAll(doubleQuotes, '`', '"');
      const o = JSON.parse(doubleQuotes);
      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object",
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (o && typeof o === 'object') {
        return o;
      }
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  static isAnObject(obj) {
    return obj !== null && typeof obj === 'object';
  }

  static base64DecodeSafe(encodedString) {
    let decoded = {};
    if (this.isNullOrEmpty(encodedString)) {
      return null;
    }
    try {
      decoded = Base64.decode(encodedString);
      // if decoded value is a stringified JSON object, return the object
      if (Helpers.tryParseJSON(decoded)) {
        decoded = JSON.parse(decoded);
      }
    } catch (error) {
      // logError('Problem decoding base64DecodeSafe:',error);
      return null;
    }
    return decoded;
  }

  // if an Object or JSON is passed-in, it will be stringified first
  static base64Encode(value) {
    if (Helpers.isAnObject(value)) {
      value = JSON.stringify(value);
    }
    return Base64.encode(value);
  }

  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
