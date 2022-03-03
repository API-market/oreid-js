import {
  AccountName,
  AccountType,
  ChainAccount,
  ChainNetwork,
  ExternalWalletType,
  PermissionName,
  PublicKey,
} from '../common/models'

// ORE ID Types

export type UserInfo = {
  accountName: AccountName
  email: string
  picture: URL
  name: string
  username: string
  permissions: UserPermission[]
}

export type UserPermission = {
  chainNetwork: ChainNetwork
  chainAccount: ChainAccount
  externalWalletType?: ExternalWalletType
  isDefault?: boolean
  isVerified?: boolean
  nickname?: string
  permission: PermissionName
  privateKeyStoredExterally?: boolean
  publicKey?: PublicKey
}

export type WalletPermission = {
  account?: AccountName
  name: PermissionName
  parent?: PermissionName
  publicKey: PublicKey
}
