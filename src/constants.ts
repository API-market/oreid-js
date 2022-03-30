import { ApiEndpoint } from './models'
const pjson = require('../package.json');

export const providersNotImplemented = ['metro']
export const defaultOreIdServiceUrl = 'https://service.oreid.io'

let tag_version = pjson.version
if(process.env.CIRCLE_TAG){
    tag_version = process.env.CIRCLE_TAG
}
export const version = tag_version
export const publicApiEndpoints = [ApiEndpoint.LoginUserWithToken] // api endpoints that dont require authorization
