const block = require("../classes/block");
const { workerData, parentPort } = require("worker_threads");
const pendingtrans = require('../data/pendingtrans.json');
const trans = require('../classes/transaction');
const int32 = require('../container/int32');
const filenum = require('../filenum');

const starting = async () => {
    const b = new block();
    var total = 0;
    var phash = "0000000000000000000000000000000000000000000000000000000000000000";
    var target = "000f000000000000000000000000000000000000000000000000000000000000";
    var count = 0;
    var list = [];
    for (x in pendingtrans) {

        const numin = pendingtrans[x][`inputs`].length;
        const numout = x[`inputs`].length;
        const transaction = new trans(numin, numout)
        for (var i = 0; i < numin; i++) {
            let id = pendingtrans[x][`inputs`][i].transactionId;
            let index = pendingtrans[x][`inputs`][i].index;
            let len = pendingtrans[x][`inputs`][i].signature.length / 2;
            let sig = pendingtrans[x][`inputs`][i].signature;
            await Transaction.addInput(id, index, len, sig);
        }
        for (var i = 0; i < numout; i++) {
            let amt = pendingtrans[x][`outputs`][i].amount;
            let len = pendingtrans[x][`outputs`][i].recipient.length;
            let recipient = pendingtrans[x][`outputs`][i].recipient;
            await Transaction.addOutput(amt, len, recipient);
        }


        const buff = transaction.convertTransactiontobyte();
        var size = int32.numto32(buff.length);
        if (total + parseInt(buff.length) < 1000000) {
            list.push(size);
            list.push(buff);
            count++;
        }

    }

    var newbuff = Buffer.concat([int32.numto32(count), ...list]);
    var wsstream = fs.createWriteStream(
        "./temp.dat"
    );
    wsstream.write(newbuff);
    wsstream.end();

    var path = "./temp.dat";

    const arr = await filenum('./data/blocks');
    const index = arr.length();

    await b.create_header(index, phash, path, target);
    await b.create_data_hash();
    parentPort.postMessage({ result: "Searching", nonce: "-1" });
    const res = await b.find_nonce();

    if (res !== false)
        parentPort.postMessage({ result: "Found", nonce: res });
    else
        parentPort.postMessage({ result: 'broken' });

}


starting();