const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");

var data = {
  id: 4
};

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "secretss").toString()
// };

// token.data.id = 20;
// var newHash = SHA256(JSON.stringify(token.data) + "secretss").toString();

// if (token.hash === newHash) {
//   console.log("Data was not changed");
// } else console.log("Data was changed!!!");

let token = jwt.sign(data, "123abc");
let verify = jwt.verify(token, "123abc");
console.log(token, "\n", verify);
