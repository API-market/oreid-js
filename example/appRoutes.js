import dotenv from 'dotenv';
dotenv.config();

//Load settings from file
var settings = process.env;
const PORT = settings.PORT || 8888;
const { OREID_API_KEY, AUTH_CALLBACK, SIGN_CALLBACK, OREID_URI, BACKGROUND_COLOR } =  process.env;

export function loginHandler(oreId) {
    return async function(req, res, next) {
        const loginType = req.params.logintype;
        console.log(`got to loginHandler:loginType`, loginType);
        let authUrl = await oreId.getOreIdAuthUrl({ loginType, callbackUrl:AUTH_CALLBACK, backgroundColor:BACKGROUND_COLOR });
        //redirect browser 
        res.redirect(authUrl);
    }
}
