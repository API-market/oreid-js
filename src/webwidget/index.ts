import { defaultOreIdServiceUrl } from '../constants'
import { defaultHeight, defaultWidth } from './constants'
import { WebWidgetProps, WebWidgetPropType } from './models'

export { DappAction, WebWidgetProps } from './models'

export const createWebWidget = () => {
  // eslint-disable-next-line global-require
  const zoid = require('zoid/dist/zoid.frameworks')
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
    context: 'iframe',
  })
  return widget
}
