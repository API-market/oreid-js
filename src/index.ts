import { Auth } from './auth/auth'
import { OreIdOptions as OreIdOptionsType } from './core/IOreIdOptions'
import OreId from './core/oreId'
import Transaction from './transaction/transaction'
import {
  getTransitProviderAttributesByChain,
  transitProviderAttributesData,
  TransitProviderAttributes as TransitProviderAttributesType,
} from './transit/transitProviders'
import { User } from './user/user'
import Helpers from './utils/helpers'
import { appendHmacToUrl, generateHmac, generateHmacWithApiKeyOrProxyServer } from './utils/hmac'
import { DummyStorage, MemoryStorage } from './utils/storage'

export * from './models'
export * from './plugins'
export {
  appendHmacToUrl,
  Auth,
  DummyStorage,
  generateHmac,
  generateHmacWithApiKeyOrProxyServer,
  getTransitProviderAttributesByChain,
  transitProviderAttributesData,
  Helpers,
  MemoryStorage,
  OreId,
  Transaction,
  User,
}

export type OreIdOptions = OreIdOptionsType
export type TransitProviderAttributes = TransitProviderAttributesType
