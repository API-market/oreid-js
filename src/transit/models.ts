import {
  DiscoveryAccount,
  DiscoverContinueCallback,
  DiscoveryOptions,
  KeyLookupCallback,
  WalletProvider,
  MakeWalletProviderFn,
  WalletAccessContext,
  Wallet,
} from '@aikon/eos-transit/lib'

import { ChainAccount, ChainNetwork, ExternalWalletType } from '../common/models'

export type TransitDiscoveryAccount = DiscoveryAccount
export type TransitDiscoverContinueCallback = DiscoverContinueCallback
export type TransitDiscoverKeyLookupCallback = KeyLookupCallback
export type TransitDiscoveryOptions = DiscoveryOptions
export type TransitWalletProviderFactory = MakeWalletProviderFn
export type TransitWalletProvider = WalletProvider
export type TransitWalletAccessContext = WalletAccessContext
export type TransitWallet = Wallet

// The DiscoveryData type is missing 'note' field in the Transit Library - replicating the type here and adding note
export type TransitDiscoveryData = {
  keyToAccountMap: DiscoveryAccount[]
  keys?: {
    index: number
    key: string
    note?: string
  }[]
}

// Not sure what this type is - perhaps what is returned from the wallet after login?
export type TransitAccountInfo = any

export type ConnectToTransitProviderParams = {
  chainAccount?: ChainAccount
  chainNetwork?: ChainNetwork
  walletType: ExternalWalletType
}

export type SetupTransitWalletParams = {
  chainNetwork?: ChainNetwork
  walletType: ExternalWalletType
}
