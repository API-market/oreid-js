import { webWidgetDef } from './constants'
import { getWindowTypeForProps, validateProps } from './helpers'

/**
 * @return var name created on window for widget
 * */
export const createWebWidgetOnWindow = async (renderToWindow: Window = window) => {
  const varOreidWidgetOnWindow = 'OreidWidget'
  if (typeof renderToWindow === 'undefined' || !renderToWindow) throw new Error('No window found to render widget')
  // eslint-disable-next-line global-require
  const zoid = require('zoid/dist/zoid')
  try {
    let OreidWidget
    // eslint-disable-next-line no-prototype-builtins
    if (renderToWindow.hasOwnProperty(varOreidWidgetOnWindow)) {
      OreidWidget = renderToWindow[varOreidWidgetOnWindow as any]
    } else {
      OreidWidget = zoid.create(webWidgetDef)
      Object.defineProperties(renderToWindow, {
        [varOreidWidgetOnWindow]: {
          value: OreidWidget,
          writable: true,
        },
      })
    }
    if (!(await OreidWidget.canRenderTo(renderToWindow))) {
      // eslint-disable-next-line no-param-reassign
      delete renderToWindow[varOreidWidgetOnWindow as any]
      throw new Error('Cannot render on window')
    }
    return varOreidWidgetOnWindow
  } catch (error) {
    // eslint-disable-next-line no-prototype-builtins
    if (renderToWindow.hasOwnProperty(varOreidWidgetOnWindow)) await zoid.destroy() // cleanup
    throw error
  }
}

/**
 * @return rendered instance of widget
 * */
export async function renderWebWidget(webWidgetProps: unknown, container: string, renderToWindow: Window = window) {
  if (typeof renderToWindow === 'undefined' || !renderToWindow) throw new Error('No window found to render widget')
  const props = validateProps(webWidgetProps)
  const containerElem = renderToWindow.document.querySelector(container)
  if (!containerElem) throw new Error(`No such element ${container} found on window's document`)
  const varOreidWidgetOnWindow = await createWebWidgetOnWindow(renderToWindow)
  const OreidWidgetComponent = (renderToWindow as any)[varOreidWidgetOnWindow](props)
  OreidWidgetComponent.render(containerElem, getWindowTypeForProps(props))
  return OreidWidgetComponent
}
