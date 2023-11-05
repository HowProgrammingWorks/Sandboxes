'use strict';

const fs = require('node:fs');
const net = require('node:net');

const printGlobalObj = () => {
  for (const [ key, val ] of Object.entries(global)) {
    console.log(`${key}: ${typeof val}`);
  }
}

printGlobalObj();

// console.log('From application global context');
// console.dir({ fs, net }, { depth: 1 });
// console.dir({ global }, { depth: 1 });
// console.dir({ api }, { depth: 2 });

setTimeout(() => {console.log('work')}, 2000);
console.log(util.format('Hello %s, %i', 'world', 1000));

const fn = (a, b) => a + b;

module.exports = {
  fn
};
