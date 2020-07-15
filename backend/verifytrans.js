const NodeRSA = require('node-rsa');
const verifytrans = async (data, pubkey, signature) => {
    const decryptionKey = new NodeRSA(pubkey);
    decryptionKey.setOptions({ signingScheme: { scheme: "pss", hash: "sha256", saltLength: 32 } });
    let result = decryptionKey.verify(data, signature, 'buffer', 'buffer');
    return result;
}

module.exports = verifytrans;





