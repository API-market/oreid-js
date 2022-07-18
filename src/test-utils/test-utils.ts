// generate JWT

import { OreId } from '..'
import { Base64 } from 'js-base64'

export const generateToken = (token: object) => {
  const string = JSON.stringify(token)
  const encoded = Base64.encode(string)
  return `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkM0N0I2NUI4OTNBRTEwN0ExNkE5MTQ0Njk2ODBCMDVEREVGQjFEMjcifQ.${encoded}.skA5HUFqxaTt2lLRKKbIl4OgvcD7iczNvZeWQXr2nKWb7kVUVWYSLLxDTqanfveALQ9YEQgo4OJnFRZ6CMSlJFQfDWPCk2YZJuIi4BOOWsN8aTuwdoD8Z6ZQWmwnCWMpMKFzVQE_ui75DST8dQAB7guR4Hk2iC5FJOmUkn_oJodMJDc3OML0xWbdrnYH2K5r4Rjq5E6X7Nqu9uHf3uZE9EhGMJOIuaBbR9ft34CEEOCA9Mzdmp0XGsc8AKrscfRDpNJsP6SP3sdOml0K-ZfSB30Ssbz_DKAzTrz5WrOCQ67FBNvpBYDsIjEt607dNMZncyYwzHB5aT2Aob7yla7JaA`
}

// https://dinochiesa.github.io/jwt/
export const getOreIdToken = () => {
  const token = {
    iss: 'https://oreid.io/',
    sub: 'google-oauth2|105741711437160993941',
    aud: [
      'https://service.oreid.io',
      'https://service.oreid.io/userinfo',
      'https://oreid.aikon.com',
      'https://aikon.auth0.com/userinfo',
    ],
    azp: 't_4683afc074ab444ebdf1bf08ed8d1757',
    scope: 'openid profile email phone',
    'https://oreid.aikon.com/appId': 't_4683afc074ab444ebdf1bf08ed8d1757',
    'https://oreid.aikon.com/provider': 'google',
    'https://oreid.aikon.com/account': 'ore1t2swc4zn',
    'https://oreid.aikon.com/adminService': 'aikon-admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 500,
  }
  return generateToken(token)
}

export const getUser = (accountName: string) => ({
  accountName,
  email: 'bruno@aikon.com',
  picture: 'https://storage.googleapis.com/oreid-files/images/user-google-oauth2|105741711437160993941-profile',
  name: 'Bruno Motta',
  username: 'bruno',
  permissions: [
    {
      chainNetwork: 'ore_test',
      chainAccount: 'ore1t2swc4zn',
      publicKey: 'EOS5RZmN256B2XFxtoUJksF3bhy6cyfhBhTGeGRQZbHd4TBg2GHc7',
      privateKeyStoredExterally: false,
      //@ts-ignore
      externalWalletType: null,
      accountType: 'native',
      isVerified: false,
      isDefault: false,
      permission: 'active',
    },
    {
      chainNetwork: 'wax_test',
      chainAccount: 'ore1t2swc4zn',
      publicKey: 'EOS8CZhk6HbbJJgGapMDuHGgh1dnh8BAT6KwKudHoSYQcZH2cAKrK',
      privateKeyStoredExterally: false,
      externalWalletType: null,
      accountType: 'native',
      isVerified: false,
      isDefault: false,
      permission: 'active',
    },
    {
      chainAccount: 'ore1t2swc4zn',
      chainNetwork: 'wax_test',
      accountType: 'native',
      isDefault: true,
      permission: 'app1tvt1fico',
    },
  ],
})

export const getOreId = () => {
  return new OreId({
    appName: 'ORE ID Sample App',
    appId: 't_4683afc074ab444ebdf1bf08ed8d1757',
    oreIdUrl: 'https://service.oreid.io',
  })
}
