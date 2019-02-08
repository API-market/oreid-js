const express = require('express');
const bodyParser = require('body-parser');
import {loginHandler, userHandler} from './appRoutes'
import dotenv from 'dotenv';
dotenv.config();

//import {OreId, asyncHandler, authCallbackHandler, signCallbackHandler} from '@apimarket/oreid-js';
import {OreId, asyncHandler, authCallbackHandler, signCallbackHandler} from '../../../index';

//Load settings from file
var settings = process.env;
const PORT = settings.PORT || 8888;
const { OREID_API_KEY, OREID_URI } =  process.env;

//Instantiate oreId
let oreId = new OreId({apiKey: OREID_API_KEY, oreIdUrl: OREID_URI});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//handle sample oreid-enabled routes
app.use('/login/:logintype', asyncHandler(loginHandler(oreId)));
app.use('/user', asyncHandler(userHandler(oreId)));

app.use('/authcallback', asyncHandler(authCallbackHandler(oreId)));
app.use('/signcallback', asyncHandler(signCallbackHandler(oreId)));

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
