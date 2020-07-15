const block = require("../classes/block");
const filenum = require("../filenum");
const peers = require("../data/peers.json");
const { default: fetch } = require("node-fetch");
const { Worker, SHARE_ENV } = require("worker_threads");

const mine = async () => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./miner/miner.js', { env: SHARE_ENV });

        worker.on('message', (msg) => {

            if (msg.result == 'found')
                resolve(true);
            else if (msg.result == 'broken')
                reject(false);
        }
        );
        worker.on('error', (err) => {
            console.log(err);
        });
        worker.on('exit', (code) => {
            console.log(code);
            console.log("Found the nonce");
        });
    })
}

const main = async () => {

    while (true) {

        const pendingtrans = require("../data/pendingtrans.json");
        if (pendingtrans == {}) {
            await new Promise((r) => setTimeout(r, 2000));
            continue;
        }
        else {
            const response = await mine();
            if (response) {
                const b = new block();
                var number = filenum("./data/blocks");
                b.process_block("./data/blocks/" + number.length - 1 + "./dat");
                for (var i = 0; i < peers.length; i++) {

                    await fetch(peers[i] + '/newBlock', {
                        body: b.blockbuffer, method: 'POST', headers: {
                            "Content-type": "application/octet-stream",
                        }
                    });

                }


            }

        }

    }


}

module.exports = main;