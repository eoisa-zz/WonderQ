'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const PORT = 8080;
const app = express();
app.use(bodyParser.json());

const Block = require('./Block');

let block = new Block();

let blockchain = Array();
blockchain.push(block.createGenesis());

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

//  Whenever a producer writes to WonderQ,
//  a message ID is generated and returned as confirmation
app.post('/write', (req, res) => {
    console.log(blockchain.length);
});

//  Whenever a consumer polls WonderQ for new messages, it gets
//  those messages which are NOT processed by any other consumer
//  that may be concurrently accessing WonderQ.
app.get('/poll', (req, res) =>{
    console.log(blockchain.length)
});