import { defaultHeight, defaultWidth, defaultOreIdServiceUrl } from './constants'
import { WebWidgetAction, WebWidgetProps } from './models'
import { webWidgetPropsSchema } from './helpers'

export const version = '1'

enum WebWidgetPropType {
  Object = 'object',
  String = 'string',
  Function = 'function',
}

enum WindowType {
  IFRAME = 'iframe',
  POPUP = 'popup',
}

export const createWebWidgetOnWindow = async (window: Window, as = 'OreidWidget') => {
  if (typeof window === 'undefined' || !window) throw new Error('No window found to render widget')
  // eslint-disable-next-line global-require
  const zoid = require('zoid/dist/zoid')
  // eslint-disable-next-line no-prototype-builtins
  if (window.hasOwnProperty(as)) await zoid.destroy()
  // eslint-disable-next-line global-require
  const OreidWidget = zoid.create({
    tag: 'oreid-web-widget',
    url: ({ props }: { props: WebWidgetProps }) =>
      new URL('action', props?.oreIdOptions?.oreIdUrl || defaultOreIdServiceUrl).href,
    dimensions: { width: defaultWidth, height: defaultHeight },
    props: {
      oreIdOptions: { type: WebWidgetPropType.Object },
      action: { type: WebWidgetPropType.Object },
      onSuccess: { type: WebWidgetPropType.Function },
      onError: { type: WebWidgetPropType.Function },
    },
  })
  if (!(await OreidWidget.canRenderTo(window))) {
    // eslint-disable-next-line no-param-reassign
    delete window[as as any]
    throw new Error('Cannot render on window')
  }
  Object.defineProperties(window, {
    [as]: {
      value: OreidWidget,
      writable: true,
    },
  })
  return as
}

export async function renderWebWidget(webWidgetProps: WebWidgetProps, window: Window, container: string) {
  if (typeof window === 'undefined' || !window) throw new Error('No window found to render widget')
  const props = await webWidgetPropsSchema.validate(webWidgetProps, { strict: true })
  const containerElem = window.document.querySelector(container)
  if (!containerElem) throw new Error(`No such element ${container} found on window's document`)
  const varOreidWidgetOnWindow = await createWebWidgetOnWindow(window)
  const context = props.action.name === WebWidgetAction.Auth ? WindowType.POPUP : WindowType.IFRAME
  const OreidWidget = (window as any)[varOreidWidgetOnWindow](props)
  Object.defineProperties(window, {
    [varOreidWidgetOnWindow]: {
      value: OreidWidget,
      writable: true,
    },
  })
  OreidWidget.render(containerElem, context)
}
