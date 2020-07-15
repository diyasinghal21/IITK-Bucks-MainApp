const bodyparser = require('body-parser');
const blockcontroller = require('../controllers/blockcontroller');
const transactioncontroller = require('../controllers/transactioncontroller');
const peerscontroller = require('../controllers/peercontroller');
const aliascontroller = require('../controllers/aliascontroller');
const express = require('express');

const router = express.Router();

var jsonParser = bodyparser.json();
var octetParser = bodyparser.raw({ type: 'application/octet-stream' });

router.get('/getblock/:n', octetParser, blockcontroller.getblock);

router.get('/getPendingTransactions', jsonParser, transactioncontroller.pendingtransaction);

router.post('/newPeer', jsonParser, peerscontroller.newPeer);

router.get('/getPeer', jsonParser, peerscontroller.getPeer);

router.post('/newblock', octetParser, blockcontroller.newBlock);

router.post('/newTransaction', jsonParser, transactioncontroller.newTransaction);

router.get('/findPeer', jsonParser, peerscontroller.FindPeer);

router.post('/addAlias', jsonParser, aliascontroller.addAlias);

router.get('/getPublicKey', jsonParser, aliascontroller.getPublicKey);

router.get('/getUnusedOutputs', jsonParser, aliascontroller.getUnusedOutputs);

router.get('/genPubKey', jsonParser, aliascontroller.genPubKey);

router.get('/genPrivateKey', jsonParser, aliascontroller.genPrivateKey);

router.post('/balance', jsonParser, aliascontroller.balance);

router.post('/createTransaction', jsonParser, transactioncontroller.processTrans);

module.exports = router;

