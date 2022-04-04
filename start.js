const { Blockchain , Transaction } = require("./blockchain");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
//const myKey = ec.keyFromPrivate('00c2c44fbfd8da3328d361f502640dceb79a086eab9f516d58b13a19a0d28e85');

const myKey = ec.keyFromPrivate('00de76570a5e6c4e627c21e5eae0c474a9c793ba474558caea199f0eed5b8145');


const myWalletAddress = myKey.getPublic('hex');

let savjeeCoin = new Blockchain();
// console.log('Mining block 1...');
// savjeeCoin.addBlock(new Block(1,"1/1/2020",{amount: 4}));
// console.log('Mining block 2...');
// savjeeCoin.addBlock(new Block(2,"2/2/2022",{amount: 10}));
//console.log(JSON.stringify(savjeeCoin,null,4));
// console.log('Is blockchain valid? ' + savjeeCoin.isChainValid());
// savjeeCoin.chain[1].data = {amount: 100};
// savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();
// console.log('Is blockchain valid? ' + savjeeCoin.isChainValid());

const tx1 = new Transaction(myWalletAddress,'public key goes here',10);
tx1.signTransaction(myKey);
savjeeCoin.addTransaction(tx1);


// savjeeCoin.createTransaction(new Transaction('address1','address2',100));
// savjeeCoin.createTransaction(new Transaction('address2','address1',50));

console.log('\n Starting the miner... ');
//savjeeCoin.minePendingTransctions('xaviers-address');
console.log('\nBalance of axvier is',savjeeCoin.getBalanceOfAddress(myWalletAddress));
savjeeCoin.minePendingTransctions(myWalletAddress);

 //console.log('\nBalance of axvier is',savjeeCoin.getBalanceOfAddress('xaviers-address'));
//console.log('\nBalance of axvier is',savjeeCoin.getBalanceOfAddress(myWalletAddress));

//  console.log('\n Starting the miner again... ');
//  savjeeCoin.minePendingTransctions('xaviers-address');

console.log('\n Starting the miner again... ');
savjeeCoin.minePendingTransctions(myWalletAddress);

// console.log('\nBalance of axvier is',savjeeCoin.getBalanceOfAddress('xaviers-address'));
console.log('\nBalance of axvier is',savjeeCoin.getBalanceOfAddress(myWalletAddress));
savjeeCoin.chain[1].transactions[0].amount = 1;
console.log('is valid chain?',savjeeCoin.isChainValid());
