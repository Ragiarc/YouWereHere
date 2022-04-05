var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const dbURL = 'mongodb+srv://user:user@cs260.q2odc.mongodb.net/youwerehere?';
mongoose.connect(dbURL);

const Addresses = require('../models/addresses');
const Address = mongoose.model('Address');

