import { ApiEndpoint } from './models'

export const providersNotImplemented = ['metro']
export const defaultOreIdServiceUrl = 'https://service.oreid.io'
export const version = '3.0.7' // Todo: This should come from package.json
export const publicApiEndpoints = [ApiEndpoint.LoginUserWithToken] // api endpoints that dont require authorization