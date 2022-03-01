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

/**
 * @returns var name created on window for widget
 * */
export const createWebWidgetOnWindow = async (renderToWindow: Window = window, as = 'OreidWidget') => {
  if (typeof renderToWindow === 'undefined' || !renderToWindow) throw new Error('No window found to render widget')
  // eslint-disable-next-line global-require
  const zoid = require('zoid/dist/zoid')
  // eslint-disable-next-line no-prototype-builtins
  if (renderToWindow.hasOwnProperty(as)) await zoid.destroy()
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
  if (!(await OreidWidget.canRenderTo(renderToWindow))) {
    // eslint-disable-next-line no-param-reassign
    delete renderToWindow[as as any]
    throw new Error('Cannot render on window')
  }
  Object.defineProperties(renderToWindow, {
    [as]: {
      value: OreidWidget,
      writable: true,
    },
  })
  return as
}

/**
 * @returns rendered instance of widget
 * */
export async function renderWebWidget(
  webWidgetProps: WebWidgetProps,
  container: string,
  renderToWindow: Window = window,
) {
  if (typeof renderToWindow === 'undefined' || !renderToWindow) throw new Error('No window found to render widget')
  const props = await webWidgetPropsSchema.validate(webWidgetProps, { strict: true })
  const containerElem = renderToWindow.document.querySelector(container)
  if (!containerElem) throw new Error(`No such element ${container} found on window's document`)
  const varOreidWidgetOnWindow = await createWebWidgetOnWindow(renderToWindow)
  const context = props.action.name === WebWidgetAction.Auth ? WindowType.POPUP : WindowType.IFRAME
  const OreidWidgetComponent = (renderToWindow as any)[varOreidWidgetOnWindow](props)
  OreidWidgetComponent.render(containerElem, context)
  return OreidWidgetComponent
}
