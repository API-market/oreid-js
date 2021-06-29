import { defaultOreIdServiceUrl } from '../constants'
import DappActions from './DappActions'

export const defineWebWidget = widgetName => {
  if (window) {
    // eslint-disable-next-line global-require
    const zoid = require('zoid/dist/zoid.frameworks')
    window[widgetName] = zoid.create({
      tag: 'oreid-web-widget',
      url: `${process.env.OREID_URL || defaultOreIdServiceUrl}/action/v1`,
      dimensions: {
        width: '500px',
        height: '500px',
      },
      props: {
        oreIdOptions: {
          type: 'object',
        },
        action: {
          type: 'string',
        },
        options: {
          type: 'object',
        },
        onSuccess: {
          type: 'function',
        },
        onError: {
          type: 'function',
        },
      },
      context: 'iframe',
    })
  }
}

export default {
  DappActions,
  defineWebWidget,
}
