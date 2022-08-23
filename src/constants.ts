import { ApiEndpoint } from './models'
export { version } from './version.json'
// const pjson = require('../package.json')
// export const { version } = pjson

export const providersNotImplemented = ['metro']
export const defaultOreIdServiceUrl = 'https://service.oreid.io'

// export const version = '4.2.99'
export const publicApiEndpoints = [ApiEndpoint.LoginUserWithToken, ApiEndpoint.NewUserWithToken] // api endpoints that dont require authorization
