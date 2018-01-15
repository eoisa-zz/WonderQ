'use strict';
const crypto = require('crypto');


class Block {
    constructor(__id__, host, index, timestamp, data, blockStatus, previousHash) {
        this.__id__ = __id__;
        this.host = host;
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.blockStatus = blockStatus;
        this.previousHash = previousHash;
        this.hash = this.hashBlock()
    }

    hashBlock() {
        let sha = crypto.createHash('sha256');
        sha.update(
            String(this.__id__ ) +
            String(this.host ) +
            String(this.index) +
            String(this.timestamp) +
            String(this.data) +
            String(this.blockStatus) +
            String(this.previousHash));
        return sha.digest('hex')
    }

    createGenesis() {
        return new Block(
            this.__id__,
            this.host,
            0,
            Date.now(),
            'Genesis Block',
            'GENESIS',
            0)
    }

    newBlock(id, host, oldBlock, ledgerData, currentStatus) {
        return new Block(
            id,
            host,
            oldBlock.index + 1,
            Date.now(),
            ledgerData,
            currentStatus,
            oldBlock.hash)
    }
}

module.exports = Block;