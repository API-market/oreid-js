import dotenv from 'dotenv';
dotenv.config();

//Load settings
const { AUTH_CALLBACK, BACKGROUND_COLOR } =  process.env;

//redirect browser to OAuth flow
export function loginHandler(oreId) {
    return async function(req, res, next) {
        const loginType = req.params.logintype;
        let authUrl = await oreId.getOreIdAuthUrl({ loginType, callbackUrl:AUTH_CALLBACK, backgroundColor:BACKGROUND_COLOR });
        //redirect browser 
        res.redirect(authUrl);
    }
}

//display user state
export function userHandler(oreId) {
    return async function(req, res, next) {
        const user = await oreId.getUser();
        console.log(`user:`,user);
        return res.status(200).json(user);
    }
}