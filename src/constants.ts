import { ApiEndpoint } from './models'

export const providersNotImplemented = ['metro']
export const defaultOreIdServiceUrl = 'http://localhost:8080' // 'https://service.oreid.io'
export const version = '3.0.0' // Todo: This should come from package.json
export const publicApiEndpoints = [ApiEndpoint.LoginUserWithToken] // api endpoints that dont require authorization
