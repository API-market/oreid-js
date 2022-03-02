import { PROP_TYPE } from 'zoid/dist/zoid'
import { WebWidgetProps } from './models'
import { defaultOreIdServiceUrl } from '../constants'

export const version = '1.0.0' // Todo: This should come from package.json
export { defaultOreIdServiceUrl }
export const webWidgetDef = {
  tag: 'oreid-web-widget',
  url: ({ props }: { props: WebWidgetProps }) =>
    new URL('action', props?.oreIdOptions?.oreIdUrl || defaultOreIdServiceUrl).href,
  dimensions: { width: '420px', height: '740px' },
  props: {
    oreIdOptions: { type: PROP_TYPE.OBJECT },
    action: { type: PROP_TYPE.OBJECT },
    onSuccess: { type: PROP_TYPE.FUNCTION },
    onError: { type: PROP_TYPE.FUNCTION },
  },
}
