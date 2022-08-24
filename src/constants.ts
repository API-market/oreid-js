import { ApiEndpoint } from './models'
export { version } from './version.json'

export const providersNotImplemented = ['metro']
export const defaultOreIdServiceUrl = 'https://service.oreid.io'

export const publicApiEndpoints = [ApiEndpoint.LoginUserWithToken, ApiEndpoint.NewUserWithToken] // api endpoints that dont require authorization
