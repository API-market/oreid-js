// NOTE: disabling cyclical reference error here as we need to reference Transaction in PopupPluginSignParams referenced in PopupPlugin which references OreIdContext
// eslint-disable-next-line import/no-cycle
import OreId from '../core/oreId'
// eslint-disable-next-line import/no-cycle
import { PluginType } from './models'

/** Plugin interface */
export interface Plugin<T> {
  type: PluginType
  description: string
  init: (oreId: OreId) => Promise<T>
}
