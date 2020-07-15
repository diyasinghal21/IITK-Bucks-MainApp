const num32 = require("../container/int32");
const num64 = require("../container/int64");
const num256 = require("../container/int256");
const strbin = require("../container/utf8");
const readline = require("readline");
const fs = require("fs");

module.exports = class Output {
  constructor(noOfcoins = " ", lenPubKey = " ", pubKey = " ") {
    this.noOfcoins = noOfcoins;
    this.lenPubKey = lenPubKey;
    this.pubKey = pubKey;
    this.buffers = [];
  }

  async create_output() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    var noOfcoins, lenPubKey, pubKey, keydata;

    const question1 = () => {
      return new Promise((resolve, reject) => {
        rl.question("Enter the number of coins ", (answer) => {
          noOfcoins = answer.toString();
          resolve();
        });
      });
    };

    const question2 = () => {
      return new Promise((resolve, reject) => {
        rl.question("Enter the path of public key ", (answer) => {
          pubKey = answer.toString();
          resolve();
        });
      });
    };

    await question1();
    await question2();

    rl.close();

    try {
      const data = fs.readFileSync(pubKey, "utf8");
      keydata = data.toString();
      lenPubKey = data.length.toString();
    } catch (err) {
      console.error(err);
    }

    this.noOfcoins = noOfcoins;
    this.lenPubKey = lenPubKey;
    this.pubKey = keydata;
    this.create_outbuf();
  }

  async create_outbuf() {
    this.buffers.push(num64.numto64(this.noOfcoins.toString()));
    this.buffers.push(num32.numto32(this.lenPubKey.toString()));
    this.buffers.push(strbin.String2Byte(this.pubKey));
  }

  print_output() {
    //console.log("\t\t Number of Coins:", this.noOfcoins);
    //console.log("\t\t length of public key", this.lenPubKey);
    //console.log("\t\t Public Key", this.pubKey);
  }
};
