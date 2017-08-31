'use strict';

// Example showing us how the framework creates an environment (sandbox) for
// appication runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
const fs = require('fs');
const vm = require('vm');

// Create a hash and turn it into the sandboxed context which will be
// the global context of an application
const context = { module: {}, console };
context.global = context;
const sandbox = vm.createContext(context);

// Read an application source code from the file
const fileName = './application.js';
fs.readFile(fileName, (err, src) => {
  // We need to handle errors here

  // Run an application in sandboxed context
  const script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);

  // We can access a link to exported interface from sandbox.module.exports
  // to execute, save to the cache, print to console, etc.
});

process.on('uncaughtException', (err) => {
  console.log('>>>' + err.stack);
});
