const numto256 = (str) => {
  var bignum = require("bignum");
  var num = bignum(str, (base = 16));
  var int256buffer = num.toBuffer({
    endian: "big",
    size: 32 /*8-byte / 64-bit*/,
  });
  return int256buffer;
};

exports.numto256 = numto256;
