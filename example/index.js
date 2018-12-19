require('dotenv').config();
const { OreId } = require('@apimarket/oreid-js');

//Load settings
const { 
    OREID_API_KEY:apiKey, 
    AUTH_CALLBACK:authCallbackUrl, 
    SIGN_CALLBACK:signCallbackUrl, 
    OREID_URI:oreIdUrl, 
    BACKGROUND_COLOR:backgroundColor
} = process.env;

let oreId = new OreId({ apiKey, oreIdUrl });

let loginType = 'facebook';
let chain = 'ore';
const account = "1p4sr4shbfdt";
const transaction = JSON.parse('{"account":"eosio","name":"newaccount","authorization":[{"actor":"1p4sr4shbfdt","permission":"active"}],"data":{"creator":"app1props222","name":"1p4ju1rsndyl","owner":{"threshold":1,"keys":[{"key":"EOS7PFsjNNFemA2e165F8oG1VaogLuN3tC7pK7Z1PKep1GSS7W7JR","weight":1}],"accounts":[],"waits":[]},"active":{"threshold":1,"keys":[{"key":"EOS7PFsjNNFemA2e165F8oG1VaogLuN3tC7pK7Z1PKep1GSS7W7JR","weight":1}],"accounts":[],"waits":[]}}}');

async function run() {
    let authUrl = await oreId.getOreIdAuthUrl({ loginType, callbackUrl:authCallbackUrl, backgroundColor });
    let signUrl = await oreId.getOreIdSignUrl({ account, callbackUrl:signCallbackUrl, transaction, chain, broadcast:false });
    let userInfo = await oreId.getUserInfo(account);
    console.log(userInfo);
}

run();


