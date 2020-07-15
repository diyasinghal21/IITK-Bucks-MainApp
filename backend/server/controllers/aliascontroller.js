const fs = require("fs");
const fetch = require("node-fetch");
const rsa = require("node-rsa");

var pubdata;
var pridata;

const addAlias = async (req, res, next) => {

    const username = req.body.alias;
    const publickey = req.body.publicKey;
    var alias = require("../../data/alias.json");
    console.log(req.body);

    if (alias[username]) {
        res.staus(400).json({ message: "Already exists!" });
    }
    else {
        alias[username] = publickey;
        console.log(alias);


        var data = JSON.stringify(alias);
        console.log(data);
        fs.writeFileSync("./data/alias.json", data, "utf8", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });

        res.status(200).json({ message: "alias saved" });
    }

}

const getPublicKey = async (req, res, next) => {

    const username = req.body.alias;
    const alias = require("../../data/alias.json");

    res.status(200).json({ publicKey: alias[username] });

}


const getUnusedOutputs = async (req, res, next) => {

    const alias = require("../../data/alias.json");
    const unusedouts = require("../../data/unusedoutsfromkey.json");
    var list;
    if (req.body.alias) {
        var key = alias[req.body.alias];
        list = (unusedouts[key]);
    }
    else if (req.body.publickey) {

        list = unusedouts[req.body.publickey];

    }
    res.status(200).json({ UnusedOutputs: list });

}

const genPubKey = async (req, res, next) => {

    const key = new rsa();
    key.setOptions({
        signingScheme: 'pss-sha256'
    });
    key.generateKeyPair();
    pubdata = key.exportKey('public');
    pridata = key.exportKey('private');
    fs.writeFileSync('publickey.pem', pubdata, 'utf8', function (err) {
        console.log(err);
    })
    res.status(200).download('publickey.pem');

}

const genPrivateKey = async (req, res, next) => {
    fs.writeFileSync('privatekey.pem', pridata, 'utf8', function (err) {
        console.log(err);
    })
    res.status(200).download('privatekey.pem');

}

const balance = async (req, res, next) => {
    var unusedoutsfromkey = require("../../data/unusedoutsfromkey.json");
    var aliases = require("../../data/alias.json");

    if (req.body.publicKey) {
        if (unusedoutsfromkey[req.body.publicKey]) {
            var amt = 0;
            for (var i = 0; i < unusedoutsfromkey[req.body.publicKey].length; i++) {
                amt = amt + parseInt(unusedoutsfromkey[req.body.publicKey][i]['amount']);
            }
            res.status(200).json({ balance: amt });
        }
        else {
            res.status(422).json({ balance: "ERR" });
        }
    }
    else if (req.body.alias) {

        var pubkey = aliases[req.body.alias];
        var amt = 0;
        if (unusedoutsfromkey[pubkey]) {
            for (var i = 0; i < unusedoutsfromkey[pubkey].length; i++) {
                amt = amt + parseInt(unusedoutsfromkey[pubkey][i]['amount']);
            }
            res.status(200).json({ balance: amt });
        }
        else {
            res.status(422).json({ balance: "0" });
        }

    }
    else {
        res.status(400).json({ balance: "Not matched the data" });
    }
}


exports.addAlias = addAlias;
exports.getPublicKey = getPublicKey;
exports.getUnusedOutputs = getUnusedOutputs;
exports.genPrivateKey = genPrivateKey;
exports.genPubKey = genPubKey;
exports.balance = balance;