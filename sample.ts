// Intialize oreId
const oreId = new OreId({
  appName: 'AI Market',
  appId: '{your appId}',
  apiKey: '{your api key}',
  serviceKey: '{your service key}',
})

const newAccountParams = {
  accountType: 'native',
  idToken: 'eyJhbGci...', // idToken from OAuth provider
  userPassword: 'Password123!',
  // name: 'John Q Test', - optional: overrides value in token if desired
  // userName: 'jqtest', - optional: overrides value in token if desired
  // email: 'email@example.com', - optional: overrides value in token if desired
}

const { accountName } = await oreId.custodialNewAccount(newAccountParams)

// Store the accountName and userPassword along with user's account in your database
