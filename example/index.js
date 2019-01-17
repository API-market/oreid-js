require('dotenv').config();
//const { OreId } = require('../src');
const { OreId } = require('@apimarket/oreid-js');

//Load settings
let { 
    OREID_API_KEY:apiKey, 
    AUTH_CALLBACK:authCallbackUrl, 
    SIGN_CALLBACK:signCallbackUrl, 
    OREID_URI:oreIdUrl, 
    BACKGROUND_COLOR:backgroundColor
} = process.env;

let oreId = new OreId({ apiKey, oreIdUrl });

//sample settings
let loginType = 'facebook';
let chain = 'ore';
let account = "1p4sr4shbfdt";
let state = "abc"; //'{"account":"eosio"}';  //Any string or stringified object
let transaction = JSON.parse('{"account":"eosio","name":"newaccount","authorization":[{"actor":"evoreidusers","permission":"1p4sr4shbfdt"}],"data":{"creator":"app1props222","name":"1p4ju1rsndyl","owner":{"threshold":1,"keys":[{"key":"EOS7PFsjNNFemA2e165F8oG1VaogLuN3tC7pK7Z1PKep1GSS7W7JR","weight":1}],"accounts":[],"waits":[]},"active":{"threshold":1,"keys":[{"key":"EOS7PFsjNNFemA2e165F8oG1VaogLuN3tC7pK7Z1PKep1GSS7W7JR","weight":1}],"accounts":[],"waits":[]}}}');
let signedCallbackResults = "https://callback.sampleapp.com/?signed_transaction=eyJzaWduYXR1cmVzIjpbIlNJR19LMV9LM1lZaDlNdHNtUFBYeUJ2allTTWt4MkoyUUtEaDlRR1ZBdFJhZjJ0OVA4ODhaaWNQR0pqaEFGYjVLam1IdkxlcHp3aXREWEUyRDhEajVkckZrbVpxNEtqeFc0cW8yIl0sInNlcmlhbGl6ZWRUcmFuc2FjdGlvbiI6eyIwIjoxODcsIjEiOjE5MCwiMiI6MjUsIjMiOjkyLCI0IjoxNDQsIjUiOjIzNSwiNiI6MjA5LCI3IjoyMjksIjgiOjE1MiwiOSI6MjQ0LCIxMCI6MCwiMTEiOjAsIjEyIjowLCIxMyI6MCwiMTQiOjEsIjE1IjowLCIxNiI6MCwiMTciOjgwLCIxOCI6MTUxLCIxOSI6MTMwLCIyMCI6MTY5LCIyMSI6MzIsIjIyIjoyMDUsIjIzIjowLCIyNCI6MCwiMjUiOjAsIjI2Ijo4NywiMjciOjQ1LCIyOCI6NjAsIjI5IjoyMDUsIjMwIjoyMDUsIjMxIjoxLCIzMiI6MCwiMzMiOjEyOCwiMzQiOjExNiwiMzUiOjIxMywiMzYiOjAsIjM3IjoxNDUsIjM4IjoxNzcsIjM5IjoyMDIsIjQwIjoxNDQsIjQxIjoyMTEsIjQyIjo1OCwiNDMiOjEzLCI0NCI6MTQ3LCI0NSI6MTM5LCI0NiI6NzMsIjQ3IjoxMywiNDgiOjQ4LCI0OSI6MCwiNTAiOjEyOCwiNTEiOjExNiwiNTIiOjIxMywiNTMiOjAsIjU0IjoxNDUsIjU1IjoxNzcsIjU2IjoyMDIsIjU3IjowLCI1OCI6MTI4LCI1OSI6MTE2LCI2MCI6MjEzLCI2MSI6MTI4LCI2MiI6MTQ0LCI2MyI6MTc3LCI2NCI6MjAyLCI2NSI6MTYsIjY2IjozOSwiNjciOjAsIjY4IjowLCI2OSI6MCwiNzAiOjAsIjcxIjowLCI3MiI6MCwiNzMiOjQsIjc0Ijo2NywiNzUiOjgwLCI3NiI6ODUsIjc3IjowLCI3OCI6MCwiNzkiOjAsIjgwIjowLCI4MSI6MTUsIjgyIjoxMTYsIjgzIjoxMTQsIjg0Ijo5NywiODUiOjExMCwiODYiOjExNSwiODciOjEwMiwiODgiOjEwMSwiODkiOjExNCwiOTAiOjMyLCI5MSI6MTE2LCI5MiI6MTExLCI5MyI6MTA3LCI5NCI6MTAxLCI5NSI6MTEwLCI5NiI6MTE1LCI5NyI6MH19&state=ImFiYyI=";
let authCallbackResults = "https://callback.sampleapp.com/?account=123456789012";

async function run() {
    let authUrl = await oreId.getOreIdAuthUrl({ loginType, callbackUrl:authCallbackUrl, backgroundColor });
    let signUrl = await oreId.getOreIdSignUrl({ account, callbackUrl:signCallbackUrl, transaction, chain, broadcast:false, state, accountIsTransactionPermission: false });
    let userInfo = await oreId.getUserInfo(account);
    let signResults = oreId.handleSignResponse(signedCallbackResults);
    let authResults = oreId.handleAuthResponse(authCallbackResults);
    console.log(userInfo);
}

run();
