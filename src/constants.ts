import { ApiEndpoint } from './models'
const pjson = require('../package.json')

export const externalWalletsNotImplemented = ['metro']
export const defaultOreIdServiceUrl = 'https://service.oreid.io'

export const { version } = pjson
export const publicApiEndpoints = [ApiEndpoint.LoginUserWithToken, ApiEndpoint.NewUserWithToken] // api endpoints that dont require authorization
