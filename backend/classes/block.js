const readline = require("readline");
const fs = require("fs");
const crypto = require("crypto");
const int32 = require("../container/int32");
const int64 = require("../container/int64");
const int256 = require("../container/int256");
const utf8 = require("../container/utf8");
const convert2int = require("../container/conver2int");
const bufftohex = require("../container/bufftohex");
const bufftostr = require("../container/bufftostr");
const now = require("nano-time");
var bignum = require("bignum");
const Transaction = require("./transaction");

module.exports = class Block {
    constructor(
        index = "",
        phash = "",
        bodyhash = "",
        target = "",
        time = "",
        nonce = "",
        blockhash = ""
    ) {
        this.index = index;
        this.phash = phash;
        this.bodyhash = bodyhash;
        this.target = target;
        this.time = time;
        this.nonce = nonce;
        this.body_buff;
        this.path = "";
        this.blockhash = blockhash;
        this.transaction = [];
        this.head_buff;
        this.blockbuffer;
    }

    async create_header() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false,
        });

        var index, phash, bodyhash, path, target;

        const question1 = () => {
            return new Promise((resolve, reject) => {
                rl.question("Enter the index of the block ", (answer) => {
                    index = answer.toString();
                    resolve();
                });
            });
        };

        const question2 = () => {
            return new Promise((resolve, reject) => {
                rl.question("Enter the hash of parent block ", (answer) => {
                    phash = answer.toString();
                    resolve();
                });
            });
        };

        const question3 = () => {
            return new Promise((resolve, reject) => {
                rl.question("Enter the target value", (answer) => {
                    target = answer.toString();
                    resolve();
                });
            });
        };

        const question4 = () => {
            return new Promise((resolve, reject) => {
                rl.question(
                    "Enter the path of the binary file of block data ",
                    (answer) => {
                        path = answer.toString();
                        resolve();
                    }
                );
            });
        };

        await question1();
        await question2();
        await question3();
        await question4();

        rl.close();

        this.index = index;
        this.phash = phash;
        this.target = target;
        this.path = path;
    }

    async create_data_hash() {
        const readfile = async () => {
            return new Promise((resolve, reject) => {
                const readStream = fs.createReadStream(this.path, {
                    highWaterMark: 16,
                });
                const data = [];
                readStream.on("data", (chunk) => {
                    data.push(chunk);
                });

                readStream.on("end", () => {
                    resolve(Buffer.concat(data));
                });

                readStream.on("error", (err) => {
                    //console.log("error :", err);
                    reject();
                });
            });
        };
        const buffer = await readfile();
        this.body_buff = buffer;
        var hash = crypto.createHash("sha256");
        var hash_update = hash.update(buffer, "binary");
        var generated_hash = hash_update.digest("hex");
        this.bodyhash = generated_hash;
    }

    async create_block_hash() {
        this.time = now();
        var list = [];
        var list1 = [];
        var buff1 = int32.numto32(this.index);
        list.push(buff1);
        var buff2 = int256.toBuffer(this.bodyhash);
        list.push(buff2);
        var buff3 = int256.toBuffer(this.phash);
        list.push(buff3);
        var buff4 = int256.toBuffer(this.target);
        list.push(buff4);
        var buff5 = int64.numto64(this.time);
        list.push(buff5);
        var buff6 = int64.numto64(this.nonce);
        list.push(buff6);

        this.head_buff = Buffer.concat(list);

        var hash = crypto.createHash("sha256");
        var hash_update = hash.update(head_buff, "binary");
        var generated_hash = hash_update.digest("hex");
        this.blockhash = generated_hash;
    }

    async find_nonce() {
        var index = bignum("0");
        var t = bignum(this.target);
        while (true) {
            this.nonce = index;
            await this.create_block_hash();
            var b = bignum(this.blockhash);
            if (this.blockhash < this.target && process.env.MINE == true) {
                var filenum;
                fs.readdir("./data/blocks", function (err, files) {
                    filenum = files.length();
                });
                var wsstream = fs.createWriteStream(
                    "./data/blocks/" + filenum + ".dat"
                );
                var list = [];
                list.push(this.head_buff);
                list.push(this.body_buff);
                var buffer = Buffer.concat(list);
                wsstream.write(buffer);
                wsstream.end();
                return this.nonce.toString();
            } else if (process.env.MINE == false) {
                return false;
            } else {
                //console.log(this.nonce.toString());
                //console.log(this.time);
                //console.log(this.blockhash);
            }
            index = bignum.add(index, bignum("1"));
        }
    }

    async process_block(blockpath) {
        const readfile = require("../readstream");
        const buff = await readfile(blockpath);
        this.blockbuffer = buff;
        // //console.log(buff);
        var index = 0;
        this.index = convert2int.fromBuffer(buff.slice(index, index + 4));
        index = index + 4;
        this.phash = bufftohex.fromBuffer(buff.slice(index, index + 32));
        index = index + 32;
        this.bodyhash = bufftohex.fromBuffer(buff.slice(index, index + 32));
        index = index + 32;
        this.target = bufftohex.fromBuffer(buff.slice(index, index + 32));
        index = index + 32;
        this.time = convert2int.fromBuffer(buff.slice(index, index + 8));
        index = index + 8;
        this.nonce = convert2int.fromBuffer(buff.slice(index, index + 8));
        index = index + 8;

        const numtrans = parseInt(
            convert2int.fromBuffer(buff.slice(index, index + 4))
        );
        console.log("***************1", numtrans);
        index = index + 4;
        for (var i = 0; i < numtrans; i++) {
            const sizetrans = parseInt(
                convert2int.fromBuffer(buff.slice(index, index + 4))
            );
            // //console.log(sizetrans);
            index = index + 4;
            const newTrans = new Transaction();
            await newTrans.convertByte2Transaction(buff.slice(index, index + sizetrans));
            index = index + sizetrans;
            this.transaction.push(newTrans);
            // delete newTrans;
        }
        console.log("%%%%%%%%%%%2");
        var unusedout = require("../data/unusedout.json");
        var pendingtrans = require("../data/pendingtrans.json");
        var unusedoutfromkey = require("../data/unusedoutsfromkey.json");
        // //console.log(this.transaction.length);
        for (var i = 0; i < parseInt(this.transaction.length); i++) {
            const element = this.transaction[i];
            for (var k = 0; k < parseInt(this.transaction[i][`numInput`]); k++) {
                var index = this.transaction[i][`inputs`][k][`index`];
                if (unusedout[this.transaction[i][`inputs`][k][`transactionId`]]) {
                    delete unusedout[this.transaction[i][`inputs`][k][`transactionId`]][
                        `${index}`
                    ];
                    for (var x in unusedoutfromkey) {
                        for (var j = 0; j < unusedoutfromkey[x].length; j++) {
                            if (
                                unusedoutfromkey[x][j][`transactionId`] ==
                                element[`inputs`][k][`transactionId`] &&
                                unusedoutfromkey[x][j][`index`] == index
                            )
                                delete unusedoutfromkey[x][j];
                        }
                    }
                    // console.log(index);
                }
            }
            console.log("&&&&&&&&&&&&&&&&&&&&3");

            unusedout[element[`transcationId`]] = {};
            for (var p = 0; p < parseInt(this.transaction[i][`numOutput`]); p++) {
                //console.log(element[`outputs`]);
                //console.log(element);
                var jsonobj = {
                    Public_Key: element[`outputs`][p][`pubKey`],
                    coins: element[`outputs`][p][`noOfcoins`],
                };

                if (unusedoutfromkey[element[`outputs`][p][`pubKey`]]) {
                    unusedoutfromkey[element[`outputs`][p][`pubKey`]].push({
                        transactionId: element[`transcationId`],
                        index: p + 1,
                        amount: element[`outputs`][p][`noOfcoins`],
                    });
                } else {
                    unusedoutfromkey[element[`outputs`][p][`pubKey`]] = [];
                    unusedoutfromkey[element[`outputs`][p][`pubKey`]].push({
                        transactionId: element[`transcationId`],
                        index: p + 1,
                        amount: element[`outputs`][p][`noOfcoins`],
                    });
                }
                unusedout[element[`transcationId`]][p + 1] = jsonobj;
            }

            delete pendingtrans[element[`transcationId`]];
        }
        console.log("(((((((((((((((((((4");
        var data = JSON.stringify(unusedout);
        fs.writeFileSync("./data/unusedout.json", data, "utf8", function (err) {
            if (err) {
                console.log(err);
            }
            //console.log("The file was saved!");
        });

        var information = JSON.stringify(pendingtrans);
        fs.writeFileSync("./data/pendingtrans.json", information, "utf8", function (
            err
        ) {
            if (err) {
                console.log(err);
            }
            //console.log("The file was saved!");
        });
        var datas = JSON.stringify(unusedoutfromkey);
        fs.writeFileSync("./data/unusedoutsfromkey.json", datas, "utf8", function (err) {
            if (err) {
                return //console.log(err);
            }
            //console.log("The file was saved!");
        });
        console.log("^^^^^^^^^^^^^^^^5");
    }

    async verify_block(blockpath) {
        const blocksfile = require("../data/blocks.json");

        const readfile = require("../readstream");
        const buff = await readfile(blockpath);
        var list = [];
        var index = 0;
        this.index = convert2int.fromBuffer(buff.slice(index, index + 4));
        index = index + 4;
        this.phash = bufftohex.fromBuffer(buff.slice(index, index + 32));
        index = index + 32;
        this.bodyhash = bufftohex.fromBuffer(buff.slice(index, index + 32));
        index = index + 32;
        this.target = bufftohex.fromBuffer(buff.slice(index, index + 32));
        index = index + 32;
        this.time = convert2int.fromBuffer(buff.slice(index, index + 8));
        index = index + 8;
        this.nonce = convert2int.fromBuffer(buff.slice(index, index + 8));
        index = index + 8;

        const numtrans = parseInt(
            convert2int.fromBuffer(buff.slice(index, index + 4))
        );
        // list.push(buff.slice(index, index + 4));
        index = index + 4;
        for (var i = 0; i < numtrans; i++) {
            const sizetrans = parseInt(
                convert2int.fromBuffer(buff.slice(index, index + 4))
            );
            // list.push(buff.slice(index, index + 4));
            index = index + 4;
            const newTrans = new Transaction();
            await newTrans.convertByte2Transaction(buff.slice(index, index + sizetrans));
            index = index + sizetrans;
            if (!newTrans.verifytrans()) return false;
            // list.push(await newTrans.convertTransactiontobyte());
            this.transaction.push(newTrans);
            // console.log("(((((((((((((((((((((((", newTrans);
        }
        var no = (parseInt(this.index) - 1).toString();
        if (blocksfile[no] != this.phash) {
            console.log("Invalid phash");
            return false;
        }

        var hash = crypto.createHash("sha256");
        var hash_update = hash.update((buff.slice(116, buff.length)), "binary");
        var generated_hash = hash_update.digest("hex");
        console.log(generated_hash);
        console.log(this.bodyhash);
        if (generated_hash != this.bodyhash) {
            console.log("Invaid bodyhash");
            return false;
        }

        this.head_buff = buff.slice(0, 116);

        var hash = crypto.createHash("sha256");
        var hash_update = hash.update(this.head_buff, "binary");
        var head_hash = hash_update.digest("hex");
        if (head_hash >= this.target) {
            console.log("Invalid nonce");
            return false;
        }

        var arr = [];
        arr.push(this.head_buff);
        arr.concat(list);
        var hash = crypto.createHash("sha256");
        var hash_update = hash.update(Buffer.concat(arr), "binary");
        var hash_of_block = hash_update.digest("hex");
        this.blockhash = hash_of_block;

        blocksfile[this.index] = this.blockhash;
        var data = JSON.stringify(blocksfile);
        fs.writeFileSync("./data/blocks.json", data, "utf8", function (err) {
            if (err) {
                console.log(err);
            }
            console.log("The file was saved!");
        });

        return true;
    }
    async verify_0_block(blockpath) {
        const blocksfile = require("../data/blocks.json");

        const readfile = require("../readstream");
        const buff = await readfile(blockpath);
        var list = [];
        var index = 0;
        this.index = convert2int.fromBuffer(buff.slice(index, index + 4));
        index = index + 4;
        this.phash = bufftohex.fromBuffer(buff.slice(index, index + 32));
        index = index + 32;
        this.bodyhash = bufftohex.fromBuffer(buff.slice(index, index + 32));
        index = index + 32;
        this.target = bufftohex.fromBuffer(buff.slice(index, index + 32));
        index = index + 32;
        this.time = convert2int.fromBuffer(buff.slice(index, index + 8));
        index = index + 8;
        this.nonce = convert2int.fromBuffer(buff.slice(index, index + 8));
        index = index + 8;

        const numtrans = parseInt(
            convert2int.fromBuffer(buff.slice(index, index + 4))
        );
        list.push(buff.slice(index, index + 4));
        index = index + 4;
        // for (var i = 0; i < numtrans; i++) {
        //     const sizetrans = parseInt(
        //         convert2int.fromBuffer(buff.slice(index, index + 4))
        //     );
        //     list.push(buff.slice(index, index + 4));
        //     index = index + 4;
        //     const newTrans = new Transaction();
        //     newTrans.convertByte2Transaction(buff.slice(index, index + sizetrans));
        //     index = index + sizetrans;
        //     if (!newTrans.verifytrans())
        //         return false;
        //     list.push(newTrans.convertTransactiontobyte);
        //     this.transaction.push(newTrans);

        // }
        if (
            this.phash !=
            "0000000000000000000000000000000000000000000000000000000000000000"
        )
            return false;

        if (numtrans > 1) return false;

        this.head_buff = buff.slice(0, 116);

        var hash = crypto.createHash("sha256");
        var hash_update = hash.update(this.head_buff, "binary");
        var head_hash = hash_update.digest("hex");
        if (head_hash >= this.target) return false;

        var arr = [];
        arr.push(this.head_buff);
        arr.concat(list);
        var hash = crypto.createHash("sha256");
        var hash_update = hash.update(Buffer.concat(arr), "binary");
        var hash_of_block = hash_update.digest("hex");
        this.blockhash = hash_of_block;

        blocksfile[this.index] = this.blockhash;
        var data = JSON.stringify(blocksfile);
        fs.writeFileSync("./data/blocks.json", data, "utf8", function (err) {
            if (err) {
                return //console.log(err);
            }
            //console.log("The file was saved!");
        });

        return true;
    }




    async process_0_block(blockpath) {
        //console.log("hi");
        //console.log(blockpath);
        const readfile = require("../readstream");
        const buff = await readfile(blockpath);
        this.blockbuffer = buff;
        //console.log(buff);
        var index = 0;
        this.index = convert2int.fromBuffer(buff.slice(index, index + 4));
        index = index + 4;
        this.phash = bufftohex.fromBuffer(buff.slice(index, index + 32));
        index = index + 32;
        this.bodyhash = bufftohex.fromBuffer(buff.slice(index, index + 32));
        index = index + 32;
        this.target = bufftohex.fromBuffer(buff.slice(index, index + 32));
        index = index + 32;
        this.time = convert2int.fromBuffer(buff.slice(index, index + 8));
        index = index + 8;
        this.nonce = convert2int.fromBuffer(buff.slice(index, index + 8));
        index = index + 8;

        //console.log(this.index);
        const numtrans = parseInt(
            convert2int.fromBuffer(buff.slice(index, index + 4))
        );
        //console.log(numtrans);
        // //console.log(numtrans);
        index = index + 4;
        for (var i = 0; i < numtrans; i++) {
            const sizetrans = parseInt(
                convert2int.fromBuffer(buff.slice(index, index + 4))
            );
            //console.log(sizetrans);
            index = index + 4;
            const newTrans = new Transaction();
            await newTrans.convertByte2Transaction(buff.slice(index, index + sizetrans));
            index = index + sizetrans;
            this.transaction.push(newTrans);
            // delete newTrans;
        }

        var unusedout = require("../data/unusedout.json");
        var pendingtrans = require("../data/pendingtrans.json");
        var unusedoutfromkey = require("../data/unusedoutsfromkey.json");
        //console.log(this.transaction.length);
        for (var i = 0; i < numtrans; i++) {
            const element = this.transaction[i];
            //     for (var k = 0; k < this.transaction[i][`numInput`]; k++) {
            //         var index = this.transaction[i][`inputs`][k][`index`];
            //         if (unusedout[this.transaction[i][`inputs`][k][`transactionId`]]) {
            //             delete unusedout[this.transaction[i][`inputs`][k][`transactionId`]][
            //                 `${index}`
            //             ];
            //             for (x in unusedoutfromkey) {
            //                 for (var i = 0; i < unusedoutfromkey[x].length; i++) {
            //                     if (
            //                         unusedoutfromkey[x][i][`transactionId`] ==
            //                         element[`inputs`][k][`transactionId`] &&
            //                         unusedoutfromkey[x][i][`index`] == index
            //                     )
            //                         delete unusedoutfromkey[x][i];
            //                 }
            //             }
            //             // //console.log(index);
            //         }
            //     }

            unusedout[element[`transcationId`]] = {};
            for (var j = 0; j < parseInt(this.transaction[i][`numOutput`]); j++) {
                var jsonobj = {
                    Public_Key: element[`outputs`][j][`pubKey`],
                    coins: element[`outputs`][j][`noOfcoins`],
                };


                if (unusedoutfromkey[element[`outputs`][j][`pubKey`]]) {
                    unusedoutfromkey[element[`outputs`][j][`pubKey`]].push({
                        transactionId: element[`transcationId`],
                        index: j + 1,
                        amount: element[`outputs`][j][`noOfcoins`],
                    });
                } else {
                    unusedoutfromkey[element[`outputs`][j][`pubKey`]] = [];
                    unusedoutfromkey[element[`outputs`][j][`pubKey`]].push({
                        transactionId: element[`transcationId`],
                        index: j + 1,
                        amount: element[`outputs`][j][`noOfcoins`],
                    });
                }
                unusedout[element[`transcationId`]][j + 1] = jsonobj;
            }

            delete pendingtrans[element[`transcationId`]];
        }


        var datax = JSON.stringify(unusedout);
        fs.writeFileSync("./data/unusedout.json", datax, "utf8", function (err) {
            if (err) {
                return //console.log(err);
            }
            //console.log("The file was saved!");
        });

        var information = JSON.stringify(pendingtrans);
        fs.writeFileSync("./data/pendingtrans.json", information, "utf8", function (
            err
        ) {
            if (err) {
                return //console.log(err);
            }
            //console.log("The file was saved!");
        });
        var datas = JSON.stringify(unusedoutfromkey);
        fs.writeFileSync("./data/unusedoutsfromkey.json", datas, "utf8", function (err) {
            if (err) {
                return //console.log(err);
            }
            //console.log("The file was saved!");
        });

    }
}


