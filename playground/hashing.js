const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var message = "My names is Malusi";
var salt = bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(message, salt, (err, hash) => {
        console.log(hash);
    });
});
var hashed = '$2a$10$pxO43EwXxh6mw/yTGy0xp.17/rGqBnvU6MD1200HF0Iqg96ZrG.YG';

bcrypt.compare(message, hashed, (err, res) => {
    console.log(res);
});
// let hashed = SHA256(message).toString();
// // console.log(message, hashed);

// let data = {
//     id:5,
// };

// let token = jwt.sign(data, 'secret');

// let decoded = jwt.verify(token, "secret");
// console.log(token);
// console.log(decoded);
