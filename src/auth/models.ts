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
