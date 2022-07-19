import { Authenticator, Chain, User } from 'universal-authenticator-library'
import { ChainAccount, ChainNetwork, ExternalWalletType, PublicKey } from '../common/models'
import { WalletPermission } from '../user/models'

// TODO: Redefine Chain
export type UalChain = Chain
export type UalUser = User

// TODO: type this. Likley should be Authenticator from EOSIO universal-authenticator-library
export type UalAuthenticatorFactory = {
  new (chains: UalChain[], options?: any): UalAuthenticator
  name: string
}

export type UalAuthenticator = Authenticator

export type ConnectToUalProviderParams = {
  chainAccount?: ChainAccount
  chainNetwork: ChainNetwork
  walletType: ExternalWalletType
}

export type ConnectToUalProviderResult = {
  isLoggedIn?: boolean
  chainAccount?: ChainAccount
  chainNetwork?: ChainNetwork
  permissions?: { name: string; publicKey: PublicKey }[]
  authenticator?: UalAuthenticator
  walletType?: ExternalWalletType
  ualUser?: UalUser
}

export type SetupUalWalletParams = {
  chainNetwork?: ChainNetwork
  walletType: ExternalWalletType
}

export type UserAccountPermissions = {
  chainAccount: ChainAccount
  chainNetwork: ChainNetwork
  permissions: WalletPermission[]
}
