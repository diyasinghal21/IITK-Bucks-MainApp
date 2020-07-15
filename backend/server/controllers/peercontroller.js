
const fs = require("fs");
const fetch = require("node-fetch");
const { json } = require("body-parser");
const init = require("../../initalisation");


const newPeer = (req, res, next) => {
    var mypeer = require("../../data/peers.json");

    const peer = req.body.url;

    if (mypeer.length >= 2)
        res.status(500).json({ message: "PEERS ARE FULL" });

    else {
        mypeer.push(peer);
        var data = JSON.stringify(mypeer);

        fs.writeFileSync("./data/peers.json", data, "utf8", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });

        res.status(201).json({ message: "Peer added succesfully" });
    }
}

const getPeer = (req, res, next) => {
    const mypeer = require("../../data/peers.json");
    res.status(200).json({ peers: mypeer });

}

const FindPeer = async (req, res, next) => {

    const body = { url: process.env.URL };
    var peers = require("../../data/peers.json");
    var potentialpeer = require("../../data/potentialpeers.json");
    while (peers.length < 2) {

        for (let index = 0; index < potentialpeer.length; index++) {

            fetch(potentialpeer[index] + "/newPeer", { method: 'POST', body: body }).then(res => {
                var status = res.status;
                return res.json();
            }).then(data => {
                if (status == 200 || status == 201) {
                    peers.push(potentialpeer[index]);
                    if (peers.length == 1) {
                        init(peers[index]);
                    }
                    fetch(potentialpeer[index] + "/getPeer", { method: 'GET' }).then(res => res.json).then(json =>
                        potentialpeer = Array.from(new Set(potentialpeer.concat(json.peers)))
                    ).catch(err => console.log(err));
                }
                else if (status == 500) {
                    // potentialpeer.splice(index);
                    fetch(potentialpeer[index], { method: 'GET' }).then(res => res.json).then(json =>
                        potentialpeer = Array.from(new Set(potentialpeer.concat(json.peers)))
                    ).catch(err => console.log(err));
                }
            }).catch(err => console.log(err));
        }
    }
    var data = JSON.stringify(potentialpeer);
    var data2 = JSON.stringify(peers);
    fs.writeFileSync("./data/peers.json", data2, 'utf8');
    fs.writeFileSync("./data/potentialpeers.json", data, 'utf8');
    res.json({ message: "Going on" });
}

exports.newPeer = newPeer;
exports.getPeer = getPeer;
exports.FindPeer = FindPeer;