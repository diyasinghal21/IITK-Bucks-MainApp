const fetch = require("node-fetch");
const peers = require("./data/peers.json");
const potential = require("./data/potentialpeers.json");
const pendingtrans = require("./data/pendingtrans.json");
const { Worker } = require("worker_threads");
const main = require("./miner/minercontroller");


const init = (url) => {
    var got = true;
    var index = 0;
    var status;
    while (got == true) {
        fetch(url + "/getBlock/" + `${index}`, { method: "GET" })
            .then((res) => {
                status = res.status;
                return res.buffer();
            })
            .then((data) => {
                if (status == 200 || status == 201) {
                    fetch("http://localhost:5000/newBlock", {
                        method: "POST",
                        body: data,
                    })
                        .then(res => console.log("Added"))
                        .catch((err) => console.log(err));
                } else got = false;
            })
            .catch((err) => console.log(err));
        index++;
    }

    fetch(url + "/getPendingTransactions", { method: 'GET' }).then(res => {
        status = res.status;
        return res.json();
    }

    ).then(
        data => {

            for (var index = 0; index < data.length; index++) {

                fetch("http://localhost:5000/newTransaction", { method: 'POST', body: data[index] }).then(res =>

                    console.log("Transaction added")
                ).catch(err => console.log(err));

            }


        }
    ).catch(err => console.log(err));


    main();


};

module.exports = init;
