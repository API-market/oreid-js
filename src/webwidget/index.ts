import { defaultOreIdServiceUrl } from '../constants'
import { defaultHeight, defaultWidth } from './constants'
import { WebWidgetProps } from './models'

export * from './models'

enum WebWidgetPropType {
  Object = 'object',
  String = 'string',
  Function = 'function',
}

export const createWebWidget = () => {
  // eslint-disable-next-line global-require
  const zoid = require('./zoid.frameworks')
  const widget = zoid.create({
    tag: 'oreid-react-web-widget',
    url: ({ props }: { props: WebWidgetProps }) => {
      const baseUrl = props?.oreIdOptions?.oreIdUrl ? props.oreIdOptions.oreIdUrl : defaultOreIdServiceUrl
      return `${baseUrl}/action`
    },
    dimensions: {
      width: defaultWidth,
      height: defaultHeight,
    },
    props: {
      oreIdOptions: {
        type: WebWidgetPropType.Object,
      },
      // action: {
      //   name: { type: WebWidgetPropType.String },
      //   params: { type: WebWidgetPropType.Object },
      // }
      // NOTE: action is an object with these two properties - Zoid types prevent us from defined them here
      action: {
        type: WebWidgetPropType.Object,
      },
      onSuccess: {
        type: WebWidgetPropType.Function,
      },
      onError: {
        type: WebWidgetPropType.Function,
      },
    },
    defaultContext: 'iframe',
  })
  return widget
}

export const createAuthWidget = () => {
  // eslint-disable-next-line global-require
  const zoid = require('./zoid.frameworks')
  const authWidget = zoid.create({
    tag: 'oreid-auth-widget',
    url: ({ props }: { props: { [key: string]: any } }) => {
      const baseUrl = props.oreIdUrl ?? defaultOreIdServiceUrl
      return `${baseUrl}/action`
    },
    dimensions: {
      width: defaultWidth,
      height: defaultHeight,
    },
    props: {
      oreIdUrl: {
        type: WebWidgetPropType.String,
        required: false,
      },
      action: {
        type: WebWidgetPropType.Object,
        required: false,
      },
      onSuccess: {
        type: WebWidgetPropType.Function,
        required: false,
      },
      onError: {
        type: WebWidgetPropType.Function,
        required: false,
      },
    },
    defaultContext: 'popup',
  })
  return authWidget
}
