import { CONTEXT } from 'zoid/dist/zoid'
import { WebWidgetAction, WebWidgetProps } from './models'

export const getWindowTypeForProps = (props: WebWidgetProps) =>
  props.action.name === WebWidgetAction.Auth ? CONTEXT.POPUP : CONTEXT.IFRAME

export const validateProps = (props: any): WebWidgetProps => {
  if (typeof props?.onSuccess === 'function' && typeof props?.onError === 'function') return props as WebWidgetProps
  throw new Error('Invalid props')
}
