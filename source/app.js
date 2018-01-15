'use strict';
const express = require('express');
const bodyParser = require('body-parser');
let axios = require('axios');

const PORT = 8080;
const app = express();
app.use(bodyParser.json());
app.set('json spaces', 4);

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
    let status = 'PRODUCED';
    let id = req.headers.id;
    let host = req.headers.host;
    let data = JSON.stringify(req.body);
    let leBlock = block.newBlock(id, host, blockchain[blockchain.length - 1], data, status);
    blockchain.push(leBlock);
    res.send('Message ID: ' + leBlock.hash);
});

//  Whenever a consumer polls WonderQ for new messages, it gets
//  those messages which are NOT processed by any other consumer
//  that may be concurrently accessing WonderQ.
app.get('/poll', (req, res) => {
    let hostChains = getHostChains();
    reachConsensus(hostChains);
    let outbound = Array();
    blockchain.forEach(block => {
        if(block.blockStatus === 'PRODUCED'){
            let status = 'CONSUMED';
            let id = block.id;
            let host = block.host;
            let data = block.data;
            let leBlock = block.newBlock(id, host, blockchain[blockchain.length - 1], data, status);
            blockchain.push(leBlock);
            outbound.push(leBlock);
        }
    });
    res.send(JSON.stringify(outbound)).then(response => {
        if(response.statusCode !== 200 || response.ti){
            outbound.forEach(message => {
                let status = 'PRODUCED';
                let id = message.id;
                let host = message.host;
                let data = message.data;
                let leBlock = block.newBlock(id, host, blockchain[blockchain.length - 1], data, status);
                blockchain.push(leBlock);
            })
        }
    })
});

app.get('/blocks', (req, res) => {
    let outbound = Array();
    blockchain.forEach((block) => {
        block = {
            "id": block.__id__,
            "host": block.host,
            "index": block.index,
            "timestamp": block.timestamp,
            "data": block.data,
            "status": block.blockStatus,
            "hash": block.hash
        };
        outbound.push(block);
    });
    let blockJson = JSON.stringify(outbound);
    res.send(blockJson)
});

function getHostChains(){
    let blockchains = Array();
    blockchain.forEach((block) => {
        if (block.status !== 'GENESIS') {
            let url = 'http://' + block.host + ':8080/blocks';
            axios.get(url).then(response =>{
                blockchains.push(JSON.parse(response.data));
            })
        }
    });
    return blockchains;
}

function reachConsensus(chains) {
    let primaryChain = blockchain;
    chains.forEach(chain => {
        if(primaryChain.length < chain.length){
            primaryChain = chain;
        }
        blockchain = primaryChain;
    })
}
