import Helpers from '../utils/helpers'

export function generateProcessId() {
  const guid = Helpers.createGuid()
  // get the last 12 digits
  const processId = guid.slice(-12)
  return processId
}
