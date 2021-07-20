import { ApiEndpoint } from './models'

export const providersNotImplemented = ['metro']
export const defaultOreIdServiceUrl = 'https://service.oreid.io'
export const version = '2.12.2' // Todo: This should come from package.json
export const publicApiEndpoints = [ApiEndpoint.LoginUserWithToken] // api endpoints that dont require authorization
