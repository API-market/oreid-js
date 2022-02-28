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

  const user = await oreid.auth.User // expects auth to have logged in first (has accessToken)
  await user.getInfo() // load user name, email, chain accounts, etc.
  console.log('user logged in: ', user.info.name)

  await oreid.auth.logout()
}

export async function signExample() {
  // Intialize oreId
  const oreid = new OreId({ appId: '1234', apiKey: 'key_123' })
  // get web popup to show UX
  const oreidWebPopUp = new OreidWebPopUp(oreid)

  // Expects login to have been completed and auth set with valid accessToken
  const user = await oreid.auth.user
  const ethAccount = user.chainAccounts.find(ca => ca.chainNetwork === 'eth_main')

  const transaction = await oreid.createTransaction({
    chainAccount: ethAccount,
    chainNetwork: 'eth_main',
    transaction: { to: '0x123...', amount: '.0001' },
  })

  if (await transaction.canAutoSign()) {
    const data = await transaction.autoSign()
    console.log('transaction signed:', data.transactionId)
  } else {
    // popup sign flow - when completed, transaction info is returned (if requested in options)
    await oreidWebPopUp.sign({
      data: {
        account: user.account,
        chainAccount: ethAccount,
        chainNetwork: 'eth_main',
        transaction: { to: '0x123...', amount: '.0001' },
      },
      onSuccess: (data: any) => {
        console.log('transaction signed:', data.transactionId)
      },
      onError: showErrors,
    })
  }

  await oreid.auth.logout()
}
