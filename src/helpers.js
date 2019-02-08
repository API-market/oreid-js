/* 
    helper functions 
 */
import jwtdecode from 'jwt-decode';
const TRACING = false; //enable when debugging to see detailed outputs

export function isNullOrEmpty (obj) {
  if (!obj) {
    return true;
  }
  if (obj === null) {
    return true;
  }
  //Check for an empty array too
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return true;
    }
  }
  return (Object.keys(obj).length === 0 && obj.constructor === Object);
}

// log data 
export function log(message, data) {
    if (TRACING == true) {
        console.log(message, data);
    }
}

export function tokenHasExpired(token) {
    var decoded = null;
    try {
      decoded = jwtDecodeSafe(token);
    }
    catch (error) {
      return true;
    }
  
    const now = Date.now().valueOf() / 1000
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
      return true;
    }
    if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
      return true;
    }
    return false;
}

export function urlParamsToArray (fullpath) {
    if (isNullOrEmpty(fullpath)) {
      return [];
    }
  
    //Grab everything after hash if it exists
    if(fullpath.includes('?')) {
      fullpath = fullpath.split("?")[1];
    }
  
    const parts = fullpath.split(/[/?/$&]/);
  
    //Everything else delimited by '/' or ',' or '&' or '?' is a parameter
    let params = [];
    if (parts.length > 0) {
      params = parts.slice(0);
    }
    // paramPairs  e.g. [ ['enabled'], [ 'abc', '123' ], [ 'dbc', '444' ] ]   -- if the parameter only has a name and no value, the value is set to true
    let paramPairs = params.map(param => splitAt(param.search(/[=]/),1)(param)); //split at first '='

    let jsonParams = {};
    //convert array to json object e.g. { enabled: true, abc: '123', dbc: '444' }
    paramPairs.forEach(pair => {
      jsonParams[pair[0]] = decodeURIComponent(pair[1]) || true;
    });
    return jsonParams;
  }

  String.prototype.replaceAll = function (search, replacement) { // eslint-disable-line
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };

  //split a string or array at a given index position
  const splitAt = (index,dropChars) => x => [x.slice(0, index), x.slice(index + dropChars)];

  //Returns Null if parse fails
  export function tryParseJSON (jsonString, unescape) {
      if (!jsonString) return null;
      let doubleQuotes = '';
      try {
        if (unescape) {
          jsonString = decodeURI(jsonString);
        }
        doubleQuotes = jsonString.replaceAll('\'', '"');
        doubleQuotes = doubleQuotes.replaceAll('`', '"');
        let o = JSON.parse(doubleQuotes);
        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === 'object') {
          return o;
        }
      }
      catch (error) {
        console.log(error)
      }
      
      return null;
    }

    export function jwtDecodeSafe(token) {
      let decoded = {};
      if(isNullOrEmpty(token)) {
        return {};
      }
      try {
        decoded = jwtdecode(token);
      }
      catch (error) {
        logError('Problem decoding token:',token);
      }
      return decoded;
    }