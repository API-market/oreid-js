require('dotenv').config();
//const { OreId } = require('@apimarket/oreid-js');
let { OreId } = require('../src');

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
let transaction = JSON.parse('{"account":"eosio","name":"newaccount","authorization":[{"actor":"evoreidusers","permission":"1p4sr4shbfdt"}],"data":{"creator":"app1props222","name":"1p4ju1rsndyl","owner":{"threshold":1,"keys":[{"key":"EOS7PFsjNNFemA2e165F8oG1VaogLuN3tC7pK7Z1PKep1GSS7W7JR","weight":1}],"accounts":[],"waits":[]},"active":{"threshold":1,"keys":[{"key":"EOS7PFsjNNFemA2e165F8oG1VaogLuN3tC7pK7Z1PKep1GSS7W7JR","weight":1}],"accounts":[],"waits":[]}}}');
let signedCallbackResults = "https://callback.sampleapp.com/?signed_transaction=eyJ0cmFuc2FjdGlvbl9pZCI6IjQ1ZjI5ZGM5ZGM5Nzk2YTBhNmFjZTkxNTljODIzNzMzM2JmNzU5YTg0NGU4NTBmYTM4YmMyZTQ4YTkyMGVlMDciLCJwcm9jZXNzZWQiOnsiaWQiOiI0NWYyOWRjOWRjOTc5NmEwYTZhY2U5MTU5YzgyMzczMzNiZjc1OWE4NDRlODUwZmEzOGJjMmU0OGE5MjBlZTA3IiwiYmxvY2tfbnVtIjo5NTUzOTM4LCJibG9ja190aW1lIjoiMjAxOC0xMi0xOVQwMjoyODo0Ni4wMDAiLCJwcm9kdWNlcl9ibG9ja19pZCI6bnVsbCwicmVjZWlwdCI6eyJzdGF0dXMiOiJleGVjdXRlZCIsImNwdV91c2FnZV91cyI6NzQzLCJuZXRfdXNhZ2Vfd29yZHMiOjE4fSwiZWxhcHNlZCI6NzQzLCJuZXRfdXNhZ2UiOjE0NCwic2NoZWR1bGVkIjpmYWxzZSwiYWN0aW9uX3RyYWNlcyI6W3sicmVjZWlwdCI6eyJyZWNlaXZlciI6InRva2VuLm9yZSIsImFjdF9kaWdlc3QiOiJhZDM3MDQ2Y2JhNjZhYWNmYTcxNDI1MDJkNjg3OTQyNWY4ZmVkZjRlYWFkODMzNGU1Mzk4NzRmOGQ4ZDkzOGFlIiwiZ2xvYmFsX3NlcXVlbmNlIjo5MjY1ODIyLCJyZWN2X3NlcXVlbmNlIjoxODgyLCJhdXRoX3NlcXVlbmNlIjpbWyJ0ZXN0Mi5hcGltIiw3XV0sImNvZGVfc2VxdWVuY2UiOjIsImFiaV9zZXF1ZW5jZSI6Mn0sImFjdCI6eyJhY2NvdW50IjoidG9rZW4ub3JlIiwibmFtZSI6InRyYW5zZmVyIiwiYXV0aG9yaXphdGlvbiI6W3siYWN0b3IiOiJ0ZXN0Mi5hcGltIiwicGVybWlzc2lvbiI6IjFwNHNyNHNoYmZkdCJ9XSwiZGF0YSI6eyJmcm9tIjoidGVzdDIuYXBpbSIsInRvIjoidGVzdDEuYXBpbSIsInF1YW50aXR5IjoiMS4wMDAwIENQVSIsIm1lbW8iOiJ0cmFuc2ZlciB0b2tlbnMifSwiaGV4X2RhdGEiOiIwMDgwNzRkNTAwOTFiMWNhMDA4MDc0ZDU4MDkwYjFjYTEwMjcwMDAwMDAwMDAwMDAwNDQzNTA1NTAwMDAwMDAwMGY3NDcyNjE2ZTczNjY2NTcyMjA3NDZmNmI2NTZlNzMifSwiY29udGV4dF9mcmVlIjpmYWxzZSwiZWxhcHNlZCI6MjcxLCJjb25zb2xlIjoiIiwidHJ4X2lkIjoiNDVmMjlkYzlkYzk3OTZhMGE2YWNlOTE1OWM4MjM3MzMzYmY3NTlhODQ0ZTg1MGZhMzhiYzJlNDhhOTIwZWUwNyIsImJsb2NrX251bSI6OTU1MzkzOCwiYmxvY2tfdGltZSI6IjIwMTgtMTItMTlUMDI6Mjg6NDYuMDAwIiwicHJvZHVjZXJfYmxvY2tfaWQiOm51bGwsImFjY291bnRfcmFtX2RlbHRhcyI6W10sImV4Y2VwdCI6bnVsbCwiaW5saW5lX3RyYWNlcyI6W3sicmVjZWlwdCI6eyJyZWNlaXZlciI6InRlc3QyLmFwaW0iLCJhY3RfZGlnZXN0IjoiYWQzNzA0NmNiYTY2YWFjZmE3MTQyNTAyZDY4Nzk0MjVmOGZlZGY0ZWFhZDgzMzRlNTM5ODc0ZjhkOGQ5MzhhZSIsImdsb2JhbF9zZXF1ZW5jZSI6OTI2NTgyMywicmVjdl9zZXF1ZW5jZSI6MTgsImF1dGhfc2VxdWVuY2UiOltbInRlc3QyLmFwaW0iLDhdXSwiY29kZV9zZXF1ZW5jZSI6MiwiYWJpX3NlcXVlbmNlIjoyfSwiYWN0Ijp7ImFjY291bnQiOiJ0b2tlbi5vcmUiLCJuYW1lIjoidHJhbnNmZXIiLCJhdXRob3JpemF0aW9uIjpbeyJhY3RvciI6InRlc3QyLmFwaW0iLCJwZXJtaXNzaW9uIjoiMXA0c3I0c2hiZmR0In1dLCJkYXRhIjp7ImZyb20iOiJ0ZXN0Mi5hcGltIiwidG8iOiJ0ZXN0MS5hcGltIiwicXVhbnRpdHkiOiIxLjAwMDAgQ1BVIiwibWVtbyI6InRyYW5zZmVyIHRva2VucyJ9LCJoZXhfZGF0YSI6IjAwODA3NGQ1MDA5MWIxY2EwMDgwNzRkNTgwOTBiMWNhMTAyNzAwMDAwMDAwMDAwMDA0NDM1MDU1MDAwMDAwMDAwZjc0NzI2MTZlNzM2NjY1NzIyMDc0NmY2YjY1NmU3MyJ9LCJjb250ZXh0X2ZyZWUiOmZhbHNlLCJlbGFwc2VkIjo1LCJjb25zb2xlIjoiIiwidHJ4X2lkIjoiNDVmMjlkYzlkYzk3OTZhMGE2YWNlOTE1OWM4MjM3MzMzYmY3NTlhODQ0ZTg1MGZhMzhiYzJlNDhhOTIwZWUwNyIsImJsb2NrX251bSI6OTU1MzkzOCwiYmxvY2tfdGltZSI6IjIwMTgtMTItMTlUMDI6Mjg6NDYuMDAwIiwicHJvZHVjZXJfYmxvY2tfaWQiOm51bGwsImFjY291bnRfcmFtX2RlbHRhcyI6W10sImV4Y2VwdCI6bnVsbCwiaW5saW5lX3RyYWNlcyI6W119LHsicmVjZWlwdCI6eyJyZWNlaXZlciI6InRlc3QxLmFwaW0iLCJhY3RfZGlnZXN0IjoiYWQzNzA0NmNiYTY2YWFjZmE3MTQyNTAyZDY4Nzk0MjVmOGZlZGY0ZWFhZDgzMzRlNTM5ODc0ZjhkOGQ5MzhhZSIsImdsb2JhbF9zZXF1ZW5jZSI6OTI2NTgyNCwicmVjdl9zZXF1ZW5jZSI6MTUsImF1dGhfc2VxdWVuY2UiOltbInRlc3QyLmFwaW0iLDldXSwiY29kZV9zZXF1ZW5jZSI6MiwiYWJpX3NlcXVlbmNlIjoyfSwiYWN0Ijp7ImFjY291bnQiOiJ0b2tlbi5vcmUiLCJuYW1lIjoidHJhbnNmZXIiLCJhdXRob3JpemF0aW9uIjpbeyJhY3RvciI6InRlc3QyLmFwaW0iLCJwZXJtaXNzaW9uIjoiMXA0c3I0c2hiZmR0In1dLCJkYXRhIjp7ImZyb20iOiJ0ZXN0Mi5hcGltIiwidG8iOiJ0ZXN0MS5hcGltIiwicXVhbnRpdHkiOiIxLjAwMDAgQ1BVIiwibWVtbyI6InRyYW5zZmVyIHRva2VucyJ9LCJoZXhfZGF0YSI6IjAwODA3NGQ1MDA5MWIxY2EwMDgwNzRkNTgwOTBiMWNhMTAyNzAwMDAwMDAwMDAwMDA0NDM1MDU1MDAwMDAwMDAwZjc0NzI2MTZlNzM2NjY1NzIyMDc0NmY2YjY1NmU3MyJ9LCJjb250ZXh0X2ZyZWUiOmZhbHNlLCJlbGFwc2VkIjo4LCJjb25zb2xlIjoiIiwidHJ4X2lkIjoiNDVmMjlkYzlkYzk3OTZhMGE2YWNlOTE1OWM4MjM3MzMzYmY3NTlhODQ0ZTg1MGZhMzhiYzJlNDhhOTIwZWUwNyIsImJsb2NrX251bSI6OTU1MzkzOCwiYmxvY2tfdGltZSI6IjIwMTgtMTItMTlUMDI6Mjg6NDYuMDAwIiwicHJvZHVjZXJfYmxvY2tfaWQiOm51bGwsImFjY291bnRfcmFtX2RlbHRhcyI6W10sImV4Y2VwdCI6bnVsbCwiaW5saW5lX3RyYWNlcyI6W119XX1dLCJleGNlcHQiOm51bGx9fQ==";
let authCallbackResults = "https://callback.sampleapp.com/?account=123456789012";

async function run() {
    let authUrl = await oreId.getOreIdAuthUrl({ loginType, callbackUrl:authCallbackUrl, backgroundColor });
    let signUrl = await oreId.getOreIdSignUrl({ account, callbackUrl:signCallbackUrl, transaction, chain, broadcast:false, accountIsTransactionPermission: false });
    let userInfo = await oreId.getUserInfo(account);
    //let signResults = oreId.handleSignResponse(signedCallbackResults);
    let authResults = oreId.handleAuthResponse(authCallbackResults);
    console.log(authResults);
}

run();
