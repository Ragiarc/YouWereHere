
import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import req from 'express/lib/request.js'
import res from 'express/lib/response.js'
//const express = require('express');
//const bodyParser = require("body-parser");
// const mongoose = require('mongoose');
// const req = require('express/lib/request');
// const res = require('express/lib/response');

import fetch from 'node-fetch';
//const fetch = await import('node-fetch')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const dbURL = 'mongodb+srv://user:user@cs260.q2odc.mongodb.net/youwerehere?';
mongoose.connect(dbURL);

const AddressSchema = new mongoose.Schema({
    address: String,
    time: String,
    city: String,
    region: String,
    nation: String
  });
const Address =  mongoose.model('Address', AddressSchema); 


app.get('/', function(req, res, next) {
    console.log("made it"); 
}); 

/* GET addresses. */
app.get('/api/addresses', function(req, res, next) {
    Address.find(function (err, addresses) {
        if (err) {
          return next(err);
        }
        res.json(addresses);
      });
});

app.get('/api/ipInfo/:ip', async (req, res) => {
    await fetch('http://www.geoplugin.net/json.gp?ip=' + req.params.ip)
      .then(data => res.json(data.data))
      .catch(() => res.status(500).send({
          message: "failed to get result from geoplugin"
      }));
})

app.delete('/api/remove/:address', async (req,res) => {
    try {
        let addr = await Address.findOne({
            address: req.params.address,
         }).exec();
        await Address.deleteOne({
            _id: addr._id
        });
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/* GET addresses. */
app.post('/api/add', async(req, res) => {
    try {
        let addr = await Address.findOne({
           address: req.body.address,
        }).exec();
        addr.address = req.body.address;
        addr.time = req.body.time;
        addr.city = req.body.city;
        addr.region = req.body.region;
        addr.nation = req.body.nation;
        await addr.save();
        res.sendStatus(200);
    } catch(error) {
        try {
            const newAddr = new Address({
                address: req.body.address,
                time: req.body.time,
                city: req.body.city,
                region: req.body.region,
                nation: req.body.nation
            });
            await newAddr.save()
            res.send(newAddr);
        } catch(error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
});



app.listen(3500, () => console.log('Server listening on port 3500!'));