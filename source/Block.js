'use strict';
const crypto = require('crypto');

class Block {
    constructor(index, timestamp, data, blockStatus, previousHash) {
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
            String(this.index) +
            String(this.timestamp) +
            String(this.data) +
            String(this.blockStatus) +
            String(this.previousHash))
        return sha.digest('hex')
    }

    createGenesis() {
        return new Block(0,
            Date.now(),
            'Genesis Block',
            'ACTIVE',
            0)
    }

    newBlock(oldBlock, ledgerData, currentStatus) {
        return new Block(
            oldBlock.index + 1,
            Date.now(),
            ledgerData,
            currentStatus,
            oldBlock.hash)
    }
}

module.exports = Block;