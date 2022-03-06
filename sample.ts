/* eslint-disable prefer-destructuring */
// // Intialize oreId
// const oreId = new OreId({
//   appName: 'AI Market',
//   appId: '{your appId}',
//   apiKey: '{your api key}',
//   serviceKey: '{your service key}',
// })

// const newAccountParams = {
//   accountType: 'native',
//   idToken: 'eyJhbGci...', // idToken from OAuth provider
//   userPassword: 'Password123!',
//   // name: 'John Q Test', - optional: overrides value in token if desired
//   // userName: 'jqtest', - optional: overrides value in token if desired
//   // email: 'email@example.com', - optional: overrides value in token if desired
// }

// const { accountName } = await oreId.custodialNewAccount(newAccountParams)

// Store the accountName and userPassword along with user's account in your database

let errors: any

const showErrors = (newErrors: any) => {
  errors = newErrors
  console.log('errors:', newErrors)
}

export async function authExample() {
  // Intialize oreId
  const oreid = new OreId({ appId: '1234' })
  // get web popup to show UX
  const oreidWebPopUp = new OreidWebPopUp(oreid)

  // popup login flow - when completed, oreid.auth object is populated with account and accessToken
  await oreidWebPopUp.login({
    data: { provider: 'google' },
    onSuccess: (data: any) => {
      console.log('user account logged-in:', data.account)
    },
    onError: showErrors,
  })

  if (errors) return // dont continue if errors during auth

  const user = oreid.auth.user // expects auth to have logged in first (has accessToken)
  await user.getData() // load user name, email, chain accounts, etc.
  console.log('user logged in: ', user.info.name)

  await oreid.auth.logout()
}

export async function signExample() {
  // Intialize oreId
  const oreid = new OreId({ appId: '1234', apiKey: 'key_123' })
  // get web popup to show UX
  const oreidWebPopUp = new OreidWebPopUp(oreid)

  // Expects login to have been completed and auth set with valid accessToken
  const user = oreid.auth.user
  await user.getData()
  // get the first ETH account in user's wallet
  const ethAccount = user.data.chainAccounts.find(ca => ca.chainNetwork === 'eth_main')
  console.log('Permission name to use to sign tx:', ethAccount.defaultPermission.name)

  // Transaction class validates transaction, accounts, etc. and adds user's account param
  const transaction = await oreid.createTransaction({
    chainAccount: ethAccount,
    chainNetwork: 'eth_main',
    transaction: { to: '0x123...', amount: '.0001' },
    signOptions: { broadcast: true },
  })

  if (await transaction.canAutoSign()) {
    const data = await transaction.autoSign()
    console.log('transaction signed:', data.transactionId)
  } else {
    // popup sign flow - when completed, transaction info is returned (if requested in options)
    await oreidWebPopUp.sign({
      data: transaction.data, // just a JSON object - same used as with createTransaction() above
      onSuccess: (data: any) => {
        console.log('transaction signed:', data.transactionId)
      },
      onError: showErrors,
    })
  }

  await oreid.auth.logout()
}
