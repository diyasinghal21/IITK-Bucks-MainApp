const fs = require('fs');

const readfile = async (path) => {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(path, { highWaterMark: 16 });
        const data = [];
        readStream.on("data", (chunk) => {
            data.push(chunk);
            // console.log("data :", chunk, chunk.length);
        });

        readStream.on("end", () => {
            // console.log("end :", Buffer.concat(data));
            resolve(Buffer.concat(data));
            // end : I am transferring in bytes by bytes called chunk
        });

        readStream.on("error", (err) => {
            console.log("error :", err);
            reject();
        });
    });
};

module.exports = readfile;