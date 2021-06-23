/* eslint-disable no-prototype-builtins */
/* eslint-disable prefer-const */

import { encode as msgPackEncode } from '@msgpack/msgpack'

// This funciton copied from algoSdk - https://github.com/algorand/js-algorand-sdk/blob/dcec38cc7926de7f54328ce28e76290ffea9fe41/src/encoding/encoding.js#L24
/**
 * containsEmpty returns true if any of the object's values are empty, false otherwise.
 * Empty arrays considered empty
 * @param obj
 * @returns {{firstEmptyKey: string, containsEmpty: boolean}} {true, empty key} if contains empty, {false, undefined} otherwise
 */
function containsEmpty(obj: any): { firstEmptyKey: string; containsEmpty: boolean } {
  // eslint-disable-next-line no-restricted-syntax
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (!obj[key] || obj[key].length === 0) {
        return { containsEmpty: true, firstEmptyKey: key }
      }
    }
  }
  return { containsEmpty: false, firstEmptyKey: undefined }
}

// This funciton copied from algoSdk - https://github.com/algorand/js-algorand-sdk/blob/dcec38cc7926de7f54328ce28e76290ffea9fe41/src/encoding/encoding.js#L41
/**
 * encode encodes objects using msgpack
 * @param obj a dictionary to be encoded. Must not contain empty or 0 values.
 * @returns {Uint8Array} msgpack representation of the object
 * @throws Error containing ERROR_CONTAINS_EMPTY_STRING if the object contains empty or zero values
 */
export function encode(obj: any) {
  const ERROR_CONTAINS_EMPTY_STRING =
    'The object contains empty or 0 values. First empty or 0 value encountered during encoding: '
  // Check for empty values
  const emptyCheck = containsEmpty(obj)
  if (emptyCheck.containsEmpty) {
    throw new Error(ERROR_CONTAINS_EMPTY_STRING + emptyCheck.firstEmptyKey)
  }

  // enable the canonical option
  const options = { sortKeys: true }
  return msgPackEncode(obj, options)
}
