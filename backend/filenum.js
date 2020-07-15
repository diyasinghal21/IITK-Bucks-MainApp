const readDirectory = async (dir) => {
    return new Promise((resolve, reject) => {
        const fs = require("fs");
        fs.readdir(dir, function (err, files) {
            resolve(files);
            if (err) {
                reject(err);
            }
        });
    });
};

module.exports = readDirectory;