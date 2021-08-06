// import OreId from './oreId';

// const createSampleTransaction = (actor, permission = 'active') => {
//   const transaction = {
//     account: 'demoapphello',
//     name: 'bye',
//     authorization: [{
//       actor,
//       permission
//     }],
//     data: {
//       user: actor
//     }
//   };
//   return transaction;
// };

// describe('OreId First Authorizer', () => {
//   let oreId;
//   let options = {
//     appId: 'demo_0097ed83e0a54e679ca46d082ee0e33a',
//     apiKey: 'demo_k_97b33a2f8c984fb5b119567ca19e4a49',
//     oreIdUrl: 'https://service.oreid.io'
//   };

//   beforeEach(() => {
//     oreId = new OreId(options);
//   });

//   describe('First Auth FLow 1', () => {
//     options = {
//       ...options,
//       authCallbackUrl: 'http://localhost.com',
//       backgroundColor: ''
//     };

//     const signOptions = {
//       provider: '12345',
//       account: 'test@test.com',
//       broadcast: '+1555555555',
//       chainAccount: 'google',
//       chainNetwork: 'CA',
//       returnSignedTransaction: 'CA',
//       state: 'CA',
//       transaction: 'CA',
//       accountIsTransactionPermission: 'CA',
//       signedTransaction: 'CA'

//     };

//     beforeEach(() => {
//       oreId = new OreId(options);
//     });

//     it('logs in with oreid', async () => {
//       const result = await oreId.login(loginOptions);
//       expect(result).toEqual({
//         errors: null,
//         loginUrl: 'https://service.oreid.io/auth#provider=google&code=12345&email=test@test.com&phone=%2B1555555555&callback_url=http%3A%2F%2Flocalhost.com&background_color=&state=abc&app_access_token=12345667&hmac=BZrp15RNYKhK131j27rwJ8A5vI75KWHpkm9rLOxzLJA='
//       });
//     });
//   });
// });
