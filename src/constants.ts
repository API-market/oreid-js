import { ApiEndpoint } from './models'

export const providersNotImplemented = ['metro']
export const defaultOreIdServiceUrl = 'https://service.oreid.io'
// This is updated at build time if using circleci
export const version = '0.0.1'
export const publicApiEndpoints = [ApiEndpoint.LoginUserWithToken] // api endpoints that dont require authorization
