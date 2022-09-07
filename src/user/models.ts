import {
  AccountName,
  ChainAccount,
  ChainNetwork,
  ExternalWalletType,
  PermissionName,
  PublicKey,
} from '../common/models'

// ORE ID Types

/** All User data retrieved including permissions */
export type UserSourceData = {
  accountName: AccountName
  email: string
  picture: URL['href']
  name: string
  username: string
  permissions: UserPermissionData[]
}

/** User personal and blockchain account information */
export type UserData = Omit<UserSourceData, 'permissions'> & {
  chainAccounts: UserChainAccount[]
}

/** Blockchain accounts associated with the user's OreId account
 *  Permissions are names for publicKeys used with the chainAccount
 *  The default permission is the one most commonly used to sign transactions for the chain account
 */
export type UserChainAccount = {
  chainNetwork: ChainNetwork
  chainAccount: ChainAccount
  /* The default permission is the one most commonly used to sign transactions for the chain account */
  defaultPermission: UserPermissionForChainAccount
  /** Permissions are publicKeys used with the chainAccount - which have been given a name
   * For most chains, there is only one permission named 'active' */
  permissions: UserPermissionForChainAccount[]
}

export interface UserPermission extends Omit<UserPermissionData, 'permission'> {
  name: PermissionName // rename permission.permission to permission.name
}

export interface UserPermissionForChainAccount extends Omit<UserPermission, 'chainAccount' | 'chainNetwork'> {
  name: PermissionName // rename permission.permission to permission.name
}

export type UserPermissionData = {
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
