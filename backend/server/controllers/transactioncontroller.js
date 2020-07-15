const fs = require("fs");
const trans = require("../../classes/transaction");
const input = require("../../classes/input");
const output = require("../../classes/output");
const buffertohex = require("../../container/bufftohex");
const rsa = require("node-rsa");
const { default: fetch } = require("node-fetch");

const pendingtransaction = (req, res, next) => {
  const pendingtrans = require("../../data/pendingtrans.json");

  res.set("Content-Type", "application/json");
  var arr = [];
  for (x in pendingtrans) {
    arr.push(pendingtrans[x]);
  }

  res.status(200).json(arr);
};

const newTransaction = async (req, res, next) => {
  var pendingtrans = require("../../data/pendingtrans.json");
  console.log(req.body);
  console.log("hi");
  var info = req.body;
  var numInput = info.inputs.length;
  var numOutput = info.outputs.length;
  const Transaction = new trans(numInput, numOutput);
  for (var i = 0; i < numInput; i++) {
    let id = info.inputs[i].transactionId;
    let index = info.inputs[i].index;
    let len = info.inputs[i].signature.length / 2;
    let sig = info.inputs[i].signature;
    await Transaction.addInput(id, index, len, sig);
  }
  for (var i = 0; i < numOutput; i++) {
    let amt = info.outputs[i].amount;
    let len = info.outputs[i].recipient.length;
    let recipient = info.outputs[i].recipient;
    await Transaction.addOutput(amt, len, recipient);
  }

  await Transaction.cal_Transid();
  // console.log(Transaction);
  pendingtrans[Transaction.transcationId] = req.body;
  var data = JSON.stringify(pendingtrans);
  fs.writeFileSync("./data/pendingtrans.json", data, "utf8", function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });

  res.status(201).json({ message: "transaction added" });
};

const processTrans = async (req, res, next) => {
  // console.log(req);
  const aliases = require("../../data/alias.json");
  const unusedouts = require("../../data/unusedoutsfromkey.json");
  var privatekey = req.body.privatekey;
  var publickey = req.body.publickey;
  var numout = parseInt(req.body.numout);
  var transdata = req.body.transdata;
  var amt = 0;
  var jsonobj = {
    "inputs": [],
    "outputs": [],
  };
  for (var i = 0; i < numout; i++) {
    amt += parseInt(transdata[i][`coins`]);
    var obj = {};
    obj["amount"] = transdata[i][`coins`];
    obj["recipient"] = aliases[transdata[i][`alias`]];
    jsonobj.outputs.push(obj);
  }

  var unusedarr = unusedouts[publickey];
  console.log(unusedarr);
  var balance = 0;
  if (unusedarr) {
    for (var j = 0; j < unusedarr.length; j++) {
      balance += parseInt(unusedarr[j][`amount`]);
    }
    console.log(balance);
    console.log(amt);
    console.log(privatekey);
    if (amt <= balance) {
      for (var k = 0; k < unusedarr.length; k++) {
        const outs = new output();
        outs.pubKey = publickey;
        outs.lenPubKey = publickey.length;
        outs.noOfcoins = unusedarr[k][`amount`];
        outs.create_outbuf();
        const key = new rsa(privatekey);
        key.setOptions({
          signingScheme: { scheme: "pss", hash: "sha256", saltLength: 32 },
        });
        const signature = key
          .sign(Buffer.concat(outs.buffers), "buffer");
        var object = {};
        object["transactionId"] = unusedarr[k][`transactionId`];
        object["index"] = unusedarr[k][`index`];
        object["signature"] = await buffertohex.fromBuffer(signature);
        jsonobj.inputs.push(object);

        // console.log(jsonobj);
      }

      if (balance - amt > 0) {
        jsonobj.outputs.push({
          amount: balance - amt,
          recipient: publickey,
        });
      }
      console.log('********', jsonobj);
      await fetch("http://localhost:5000/newTransaction", {
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify(jsonobj)
      })
        .then((res) => console.log("Transaction added"))
        .catch((err) => console.log(err));
      res.status(201).json({ message: "Transaction added" });
    } else {
      res.status(401).json({ message: "Transaction not validated1" });
    }
  } else {
    res.status(401).json({ message: "Transaction not validated2" });
  }
};

exports.pendingtransaction = pendingtransaction;
exports.newTransaction = newTransaction;
exports.processTrans = processTrans;
