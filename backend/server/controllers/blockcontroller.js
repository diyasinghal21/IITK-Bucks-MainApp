const fs = require("fs");
const block = require("../../classes/block");
const readstream = require("../../readstream");

const getblock = async (req, res, next) => {

    const b_num = req.params.n;
    res.set('Content-Type', 'application/octet-stream');
    try {
        // const buffer = await readstream('./data/blocks/' + b_num + '.dat');
        // res.status(200).send(buffer);
        res.status(200).download('./data/blocks/' + b_num + '.dat');
    } catch (err) {
        res.status(404).json({ message: "Not found" });
    }

}

const newBlock = async (req, res, next) => {

    const readdir = require("../../filenum");
    const blocksfile = require("../../data/blocks.json");
    var filenum = await readdir("./data/blocks");
    const filewrite = (data, path) => {
        return new Promise((resolve, reject) => {
            const wstream = fs.createWriteStream(
                path
            );
            wstream.write(data);
            wstream.end();
            resolve();
        })
    }
    await filewrite(req.body, './data/blocks/' + filenum.length + '.dat');
    const b = new block();
    var result;
    if (filenum.length == 0) {
        result = await b.verify_0_block('./data/blocks/' + filenum.length + '.dat');
        console.log(result);

    }
    else {
        result = await b.verify_block('./data/blocks/' + filenum.length + '.dat');
        console.log(result);
    }
    // //console.log(b);
    if (result == true && filenum.length == 0) {
        await b.process_0_block('./data/blocks/' + filenum.length + '.dat');
        console.log(b.index);
        blocksfile[b.index] = b.blockhash;
        fs.writeFileSync("./data/blocks.json", JSON.stringify(blocksfile), "utf8", function (err) {
            if (err) {
                return //console.log(err);
            }
            //console.log("The file was saved!");
        });
        res.status(201).json({ message: "Block file added" });
        process.env.MINE = "false";
    }
    else if (result == true) {
        await b.process_block('./data/blocks/' + filenum.length + '.dat');
        console.log(b.index);
        blocksfile[b.index] = b.blockhash;
        fs.writeFileSync("./data/blocks.json", JSON.stringify(blocksfile), "utf8", function (err) {
            if (err) {
                return //console.log(err);
            }
            //console.log("The file was saved!");
        });
        res.status(201).json({ message: "Block file added" });
        process.env.MINE = "false";
    }
    else
        res.status(422).json({ message: "Invalid Block" });
}



exports.getblock = getblock;
exports.newBlock = newBlock;