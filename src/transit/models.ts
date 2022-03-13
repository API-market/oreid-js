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

// Transit Signature Provider

/** Generic SignatureProvider interface */
export interface SignatureProvider {
  /** Public keys associated with the private keys that the `SignatureProvider` holds */
  getAvailableKeys: () => Promise<string[]>
  /** Sign a transaction */
  sign: (args: SignatureProviderArgs) => Promise<SignatureProviderSignResult>
}

/** SignatureProvider params for sign() function */
export interface SignatureProviderArgs {
  /** Chain transaction is for */
  chainId: string
  /** Public keys associated with the private keys needed to sign the transaction */
  requiredKeys: string[]
  /** Transaction to sign */
  serializedTransaction: Uint8Array
  /** ABIs for all contracts with actions included in `serializedTransaction` */
  abis: BinaryAbi[]
}

/** Arguments for `push_transaction` */
export interface SignatureProviderSignResult {
  signatures: string[]
  serializedTransaction: Uint8Array
}

/** Structure for the raw form of ABIs */
export interface BinaryAbi {
  /** account which has deployed the ABI */
  accountName: string
  /** abi in binary form */
  abi: Uint8Array
}
