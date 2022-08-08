import { AuthProvider, ChainAccount, ChainNetwork, ExternalWalletType } from '../common/models'

/** Raw data extracted from OAuth IDToken */
export type IdToken = {
  sub: string
  nickname: string
  phone_number: string
  email: string
  picture: string
  name: string
  email_verified?: boolean
}

/** Oauth JWTToken */
export type JWTToken = {
  iss: string
  sub: string
  aud: string
  exp: number
  nbf: number
  iat: number
  jti: string
} & { [key: string]: any }

export type LoginOptions = {
  provider?: AuthProvider
  idToken?: string
  chainAccount?: ChainAccount
  chainNetwork?: ChainNetwork
  code?: string
  email?: string
  phone?: string
  state?: string
  linkToAccount?: boolean
  returnAccessToken?: boolean
  returnIdToken?: boolean
}

export type LoginWithWalletOptions = {
  /** Optionally specify a specific account to select from wallet (some wallets don't support this) */
  chainAccount?: ChainAccount
  /** Optionally specify a specific blockchain to select from wallet (some wallets don't support this) */
  chainNetwork?: ChainNetwork
  walletType?: ExternalWalletType
}

export type LoginWithTokenOptions = {
  /** accessToken issued by provider specified (or ORE ID if no provider specified) */
  accessToken?: string
  idToken?: string
  /** the OAuth provider that issued the accessToken */
  provider?: AuthProvider
}

export type NewUserWithTokenOptions = {
  /** accessToken issued by provider specified */
  accessToken?: string
  idToken?: string
  /** the OAuth provider that issued the accessToken */
  provider?: AuthProvider
}
