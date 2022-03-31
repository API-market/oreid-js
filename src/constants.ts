import { ApiEndpoint } from './models'
const pjson = require('../package.json');

export const providersNotImplemented = ['metro']
export const defaultOreIdServiceUrl = 'https://service.oreid.io'

export const version = pjson.version
export const publicApiEndpoints = [ApiEndpoint.LoginUserWithToken] // api endpoints that dont require authorization
