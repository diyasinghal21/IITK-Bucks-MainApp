const num32 = require("../container/int32");
const num64 = require("../container/int64");
const num256 = require("../container/int256");
const strbin = require("../container/utf8");
const readline = require("readline");

module.exports = class Input {
  constructor(
    transactionId = "0",
    index = "0",
    lenSign = "0",
    signature = "0"
  ) {
    this.transactionId = transactionId;
    this.index = index;
    this.lenSign = lenSign;
    this.signature = signature;
    this.buffers = [];
  }

  async create_input() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    var transactionId, index, lenSign, signature;

    const question1 = () => {
      return new Promise((resolve, reject) => {
        rl.question("Enter the transaction id ", (answer) => {
          transactionId = answer.toString();
          resolve();
        });
      });
    };

    const question2 = () => {
      return new Promise((resolve, reject) => {
        rl.question("Enter the index ", (answer) => {
          index = answer.toString();
          resolve();
        });
      });
    };

    const question3 = () => {
      return new Promise((resolve, reject) => {
        rl.question("Enter the signature ", (answer) => {
          signature = answer;
          resolve();
        });
      });
    };
    await question1();
    await question2();
    await question3();

    rl.close();

    lenSign = (signature.length / 2).toString();
    this.transactionId = transactionId;
    this.index = index;
    this.lenSign = lenSign;
    this.signature = signature;
    this.create_buffer();
  }

  async create_buffer() {
    this.buffers.push(num256.numto256(this.transactionId));
    this.buffers.push(num32.numto32(this.index));
    this.buffers.push(num32.numto32(this.lenSign.toString()));
    this.buffers.push(Buffer.from(this.signature, "hex"));
  }

  print_inputdata() {
    //console.log("\t\t Transaction Id:", this.transactionId);
    //console.log("\t\t Index", this.index);
    //console.log("\t\t Signature Length", this.lenSign);
    //console.log("\t\t Signature", this.signature);
  }
};
