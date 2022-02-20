import { AccountName, AccountType, ChainAccount, ChainNetwork, PermissionName, PublicKey } from '../common/models'

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
  permissionName: PermissionName
  publicKey: PublicKey
  privateKeyStoredExterally: false
  externalWalletType: null
  accountType: AccountType
  permission: PermissionName
}

export type WalletPermission = {
  account?: AccountName
  name: PermissionName
  parent?: PermissionName
  publicKey: PublicKey
}
