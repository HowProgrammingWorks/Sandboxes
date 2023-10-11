const util = require('util');

const name = 'John';
const age = 30;
const message = util.format('Привіт, мене звати %s і мені %d років.', name, age);

console.log(message);
