import OreId from '../core/oreId'

export enum PluginType {
  Popup = 'popup',
}

/** Plugin interface */
export interface Plugin<T> {
  type: PluginType
  description: string
  init: (oreId: OreId) => Promise<T>
}
