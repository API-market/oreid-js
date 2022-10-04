import { ApiEndpoint } from './models'
import versionJson from './version.json'

export const externalWalletsNotImplemented = ['metro']
export const defaultOreIdServiceUrl = 'https://service.oreid.io'
export const { version } = versionJson
export const publicApiEndpoints = [ApiEndpoint.LoginUserWithToken, ApiEndpoint.NewUserWithToken] // api endpoints that dont require authorization
