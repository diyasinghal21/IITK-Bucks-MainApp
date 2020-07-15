const rsa = require("node-rsa");

const fs = require("fs");
const bufftohex = require("./container/bufftohex");
const verifytrans = require("./verifytrans");




const func = async () => {
    var info = fs.readFileSync('./a_private.pem', 'utf8');
    // console.log(info, info.length);
    var key = new rsa(info);
    key.setOptions({
        signingScheme: {
            hash: 'sha256',
            saltLength: 32,
            scheme: 'pss'
        }
    })
    var pubkey = fs.readFileSync('./a_private.pem', 'utf8');
    var data = "cc7f49ea1a79fea25e82eb187f674b75bfa80e99155d088866f8f32d7ef1212c00000001659509c0d11708c86f2528a2d5fa0202b79f29b6fa550b1a6d7f4893a60c976d";
    var str = Buffer.from(data, 'hex');
    // console.log("mee");
    var inform = Buffer.from("93405fa8b1dc65ec1c977b71b72cade087def7a5e0579f1b38182e2af90dab3be462590e3949a4db2785da90abf1dc756b054350932da2442de24f849ecdde6c4a8c6ad9664bddb83d2fb24a4b593bceb8d7e86243892c27dd7144ee45191e40f56437d7a52245bd2974b63f8d0758bafca2911a55a24e282a848e1597dd931d472b0e44556eddaf57f9c4ff026d58a58fcb36995e5d37e1595c0a715ed5d3d49f512287037f58315229bbad4b3a801aa7bcc1078dd856edc52404b98b8b6dd7e8b76be6b0575744532da46fdf967cdafcd1d160952b8f60c5fedd827c45b3ab673a5d203af4ba37c49295b0a01077f08186bc03d4599c9471d05db1b3d0955d", 'hex');
    var buff = key.sign(str, 'buffer');
    var sig = bufftohex.fromBuffer(buff);
    console.log(sig);


    var result = await verifytrans(str, pubkey, inform);
    console.log(result);
}
func();


