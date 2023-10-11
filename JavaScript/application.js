'use strict';

// File contains a small piece of the source to demonstrate main module
// of a sample application to be executed in the sandboxed context by
// another pice of code from `framework.js`. Read README.md for tasks.

const fs = require('node:fs');
const net = require('node:net');

// Print from the global context of application module
console.log('From application global context');
console.dir({ fs, net }, { depth: 1 });
console.dir({ global }, { depth: 1 });
console.dir({ api }, { depth: 2 });

setTimeout(() => {console.log('work')}, 2000);

module.exports = () => {
  // Print from the exported function context
  console.log('From application exported function');
};
