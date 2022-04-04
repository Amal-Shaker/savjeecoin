const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const fs = require("fs");

const fileName = "./blochain.json";
class Transaction{
    constructor(fromAddress , toAddress , amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;

    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('you cannot sign transaction for other wallests!');
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx,'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.fromAddress === null) return true;
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }


}

class Block{
    constructor(timestamp,transactions,previousHash = ''){
       
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    // constructor(index,timestamp,transactions,previousHash = ''){
    //     this.index = index;
    //     this.timestamp = timestamp;
    //     this.transactions = transactions;
    //     this.previousHash = previousHash;
    //     this.hash = this.calculateHash();
    //     this.nonce = 0;
    // }
    // calculateHash(){
    //     return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    // }
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce ++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;

    }
}

class Blockchain{
    chain = require(fileName);
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
          //   this.difficulty = 5;
             this.pendingTransaction = [];
             this.miningReward = 100;
             fs.writeFile(
                fileName,
                JSON.stringify(chain, null, 2),
                function writeJSON(err) {
                  if (err) return console.log(err);
                }
              );

    };
    
    createGenesisBlock(){
        return new Block("1/10/2021","Genesis block","0");
    }
    getlatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    minePendingTransctions(miningRewardAddress){
        let block = new Block(Date.now(),this.pendingTransaction);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress ,this.miningReward)
        ];

    }
    // createTransaction(transaction){
    //     this.pendingTransaction.push(transaction);
    // }
    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transcation must include from and to address');
        }

        if(!transaction.isValid()){
            throw new Error('cannot add invalid transcation to chain');
        }
        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }
    // addBlock(newBlock){
    //     newBlock.previousHash = this.getlatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //    // newBlock.hash = newBlock.calculateHash();
    //     this.chain.push(newBlock);
    // }
    isChainValid(){
        for(let i = 1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if(!currentBlock.hasValidTransactions()){
                return false;
            }
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }

        }
      return true;  
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;