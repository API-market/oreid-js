const express = require('express');
const bodyParser = require('body-parser');
import {asyncHandler, authCallbackHandler, signCallbackHandler} from '../src/./middleware';
import {loginHandler} from './appRoutes'
import dotenv from 'dotenv';
dotenv.config();
const { OreId } = require('../src');

//Load settings from file
var settings = process.env;
const PORT = settings.PORT || 8888;
const { OREID_API_KEY, AUTH_CALLBACK, SIGN_CALLBACK, OREID_URI, BACKGROUND_COLOR } =  process.env;

let oreId = new OreId({apiKey: OREID_API_KEY, oreIdUrl: OREID_URI});
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/login/:logintype', asyncHandler(loginHandler(oreId)));

app.use('/authcallback', asyncHandler(authCallbackHandler(oreId)));
app.use('/signcallback', asyncHandler(signCallbackHandler(oreId)));

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
