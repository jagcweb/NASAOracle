const Web3 = require('web3');
const tx = require('ethereumjs-tx').Transaction;
const fetch = require('cross-fetch');

//load jsons
const contract = require('../build/contracts/Oracle.json');

//instance web3
const web3 = new Web3('ws://localhost:7545');

const addressContract = '0x23D721190afB4Be460444f1F69FD26eCeD0d2402';
const contractInstance = new web3.eth.Contract(contract.abi, addressContract);
const privateKey = Buffer.from('7d8392e7ee1c0e5709be2503571f7ca8e1b4cdc8567b432851fca2bef4d58aa5', 'hex');
const address = '0xd3bAE0E44daeA916C2Ad814Fe9494245B3a36F2d';

const blockNum = web3.eth.getBlockNumber().then(n => listenEvent(n - 1));

const listenEvent = (lastBlock) => {
    contractInstance.events.consumeAPI({}, { fromBlock: lastBlock, toBlock: 'latest' }, (err, event) => {
        event ? updateData() : null
        err ? console.log(err) : null
    })
}

const updateData = () => {
    const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY';

    fetch(url)
        .then(response => response.json())
        .then(json => setDataContact(json.element_count))
}

const setDataContract = (_value) => {
    web3.eth.getTransactionCount(address, (error, result) => {
        contractInstance.methods.setAsteroids(_value.estimateGas({}, (err, gasAmount) => {
            let rawTx = {
                nonce: web3.utils.toHex(txNumber),
                gasPrice: web3.utils.toHex(web3.utils.toWei('1.4', 'gwei')),
                gasLimit: web3.utils.toHex(gasAmount),
                to: addressContract,
                value: '0x00',
                data: contractInstance.methods.setAsteroids(_value).encodeABI(),
            }

            const tx = new Tx(rawTx);
            tx.sign(privateKey);
            const serializedTx = tx.serialize().toString('hex');
            web3.eth.sendSignedTransaction(`0x${serializedTx}`);
        }))
    });
}