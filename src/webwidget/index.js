import requireFromUrl from 'require-from-url/sync'

const oreIdServiceBaseaUrl = process.env.ORE_ID_SERVICE_BASE_URL || 'https://service.oreid.io'

const WebWidget = requireFromUrl(`${oreIdServiceBaseaUrl}/.well-known/ore-id-web-widget.js`)

export default WebWidget
