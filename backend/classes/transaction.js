const Input = require("./input");
const Output = require("./output");
const readline = require("readline");
const fs = require("fs");
const crypto = require("crypto");
const num32 = require("../container/int32");
const num64 = require("../container/int64");
const num256 = require("../container/int256");
const strbin = require("../container/utf8");
const bufftohex = require("../container/bufftohex");
const bufftostr = require("../container/bufftostr");
const convert2int = require("../container/conver2int");


module.exports = class Transaction {
  constructor(numInput, numOutput) {
    this.transcationId = 0x0;
    this.numInput = numInput;
    this.numOutput = numOutput;
    this.inputs = [];
    this.outputs = [];
    this.inputs_buff = [];
    this.outputs_buff = [];
  }
  async addInput(id, index, len, sig) {
    const input = new Input(id, index, len, sig);
    await input.create_buffer();
    this.inputs_buff.push(Buffer.concat(input.buffers));
    this.inputs.push(input);
  }

  async addOutput(amt, len, recipient) {
    const output = new Output(amt, len, recipient);
    await output.create_outbuf();
    this.outputs_buff.push(Buffer.concat(output.buffers));
    this.outputs.push(output);
  }

  async createTransaction() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    var numInput, numOutput;
    const question1 = () => {
      return new Promise((resolve, reject) => {
        rl.question("Enter the number of inputs ", (answer) => {
          numInput = answer;
          resolve();
        });
      });
    };

    const question2 = () => {
      return new Promise((resolve, reject) => {
        rl.question("Enter the number of outputs ", (answer) => {
          numOutput = answer;
          resolve();
        });
      });
    };
    await question1();
    await question2();

    rl.close();

    this.numInput = numInput;
    this.numOutput = numOutput;

    for (var i = 0; i < numInput; i++) {
      await this.addInput();
    }
    for (var i = 0; i < numOutput; i++) {
      await this.addOutput();
    }

    var list = [];
    list.push(num32.numto32(numInput.toString()));
    list.push(Buffer.concat(this.inputs_buff));
    list.push(num32.numto32(numOutput.toString()));
    list.push(Buffer.concat(this.outputs_buff));
    const newbuff = Buffer.concat(list);
    var hash = crypto.createHash("sha256");
    var hash_update = hash.update(newbuff, "binary");
    var generated_hash = hash_update.digest("hex");
    this.transcationId = generated_hash;
    return newbuff;
  }

  convertTransactiontobyte() {
    var list = [];
    list.push(Buffer.concat(this.inputs_buff));
    list.push(Buffer.concat(this.outputs_buff));
    var newbuff = Buffer.concat(list);
    return newbuff;
  }

  async cal_Transid() {

    var list = [];
    list.push(num32.numto32(this.numInput.toString()));
    list.push(Buffer.concat(this.inputs_buff));
    list.push(num32.numto32(this.numOutput.toString()));
    list.push(Buffer.concat(this.outputs_buff));
    const newbuff = Buffer.concat(list);
    var hash = crypto.createHash("sha256");
    var hash_update = hash.update(newbuff, "binary");
    var generated_hash = hash_update.digest("hex");
    this.transcationId = generated_hash;

  }

  async convertByte2Transaction(buff) {
    var hash = crypto.createHash("sha256");
    var hash_update = hash.update(buff, "binary");
    var generated_hash = hash_update.digest("hex");
    this.transcationId = generated_hash;

    var i = 0;
    const noofInputs = convert2int.fromBuffer(buff.slice(i, i + 4));
    this.numInput = noofInputs;
    var n = parseInt(this.numInput);
    i = i + 4;

    for (var index = 1; index <= n; index++) {
      const input = new Input();
      input.transactionId = bufftohex.fromBuffer(buff.slice(i, i + 32));
      i = i + 32;
      input.index = convert2int.fromBuffer(buff.slice(i, i + 4));
      i = i + 4;
      input.lenSign = convert2int.fromBuffer(buff.slice(i, i + 4));
      var len = parseInt(input.lenSign);
      i = i + 4;
      input.signature = bufftohex.fromBuffer(buff.slice(i, i + len));
      i = i + len;
      this.inputs.push(input);
      await input.create_buffer();
      this.inputs_buff.push(Buffer.concat(input.buffers));
    }

    const noofOutputs = convert2int.fromBuffer(buff.slice(i, i + 4));
    console.log("-------------", noofOutputs);
    this.numOutput = noofOutputs;
    //console.log("****************", this.numOutput);
    var m = parseInt(noofOutputs);
    // //console.log(m);
    i = i + 4;
    for (var index = 1; index <= m; index++) {
      //console.log("%%%%%%%%%%%%%%");
      const output = new Output();
      output.noOfcoins = convert2int.fromBuffer(buff.slice(i, i + 8));
      i = i + 8;
      output.lenPubKey = convert2int.fromBuffer(buff.slice(i, i + 4));
      var len = parseInt(output.lenPubKey);
      i = i + 4;
      output.pubKey = bufftostr.fromBuffer(buff.slice(i, i + len));
      i = i + len;
      this.outputs.push(output);
      await output.create_outbuf();
      this.outputs_buff.push(Buffer.concat(output.buffers));
      // //console.log(output);
    }
    //   //console.log("Transaction ID : ", this.transcationId);
    //   for (var i = 1; i <= this.numInput; i++) {
    //     console.log("\t Input", i, ":");
    //     this.inputs[i - 1].print_inputdata();
    //   }
    //   for (var i = 1; i <= this.numOutput; i++) {
    //     //console.log("\t Output", i, ":");
    //     this.outputs[i - 1].print_output();
    //   }
    //   console.log(this.outputs);
  }

  async verifytrans() {
    var total = 0;
    var flag = 0;
    const unusedout = require("../data/unusedout.json");
    const verifytrans = require("../verifytrans");
    //unused list checking
    for (var i = 0; i < this.numInput; i++) {
      // //console.log(this.inputs);
      if (this.inputs[i][`transactionId`] in unusedout) {
        if (this.inputs[i][`index`] in unusedout[this.inputs[i][`transactionId`]]) {
          flag = 1;
          total = total + unusedout[this.inputs[i][`transactionId`]][this.inputs[i][`index`]]["coins"];
        }
        else {
          flag = 0;
          break;
        }
      }
      else {
        flag = 0;
        break;
      }
    }
    //coins total checking
    if (flag == 1) {
      var out = 0;
      for (var i = 0; i < this.numOutput; i++) {
        out = out + this.outputs[i][`noOfcoins`];
      }
      if (out < total) {
        flag = 1;
      }
      else {
        flag = 0;
      }
    }
    //all signatures checking
    if (flag == 1) {

      for (var i = 0; i < this.numInput; i++) {
        var list = [];
        var list2 = [];
        list.push(num256.numto256(this.inputs[i].transactionId));
        list.push(num32.numto32(this.inputs[i].index));
        list2.push(num32.numto32(this.numOutput));
        list2.push(this.outputs_buff);
        var outbuf = Buffer.concat(list2);
        var hash = crypto.createHash("sha256");
        var hash_update = hash.update(outbuf, "binary");
        var generated_hash = hash_update.digest("hex");
        list.push(num256.numto256(generated_hash));
        var bufres = Buffer.concat(list);
        var pubKey = unusedout[this.inputs[i][`transactionId`]][this.inputs[i][`index`]["publickey"]];
        var sig = Buffer.from(str, 'hex');
        if (await verifytrans(bufres, pubKey, sig)) {
          unusedout[this.inputs[i][`transactionId`]].remove(this.inputs[i][`index`]);
          flag = 1;
        }
        else {
          flag = 0;
          break;
        }

      }
    }
    if (flag == 1)
      return true;
    else
      return false;

  }

};
