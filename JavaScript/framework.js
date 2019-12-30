'use strict';

// File contains a small piece of the source to demonstrate main module
// of a sample application to be executed in the sandboxed context by
// another pice of code from `framework.js`.

// The framework can require core libraries

// Tests require to initialize 'api', but with it, code is not running!
let api;
global.api = {};
api.vm = require('vm');
api.fs = require('fs');
api.util = require('util');

// This is a wrapper for 'console.log' to add more info into console output
//in the following format: `<applicationName> <time> <message>`
const wrapC = (path, fn) => message => {
  console.log(`application: ${path}`);
  const time = 'Time: ' + new Date();
  console.log(time);
  fn(message);
};
// Function for
const def = obj =>
  Object.keys(obj).reduce(
    (hash, key) => ((hash[key] = typeof obj[key]), hash),
    {}
  );

// Wrap 'require' function for logging to a file in the format: `<time> <module name>`
const req = name => {
  const message = 'ModuleName: ' + name + '\nTime:' + new Date();
  console.log(message);
  return require(name);
};
// Print application parameter count and source code
const countArgs = f => console.log(f.length);
const content = f => console.log(f.toString());

const runSandboxed = path => {
  // Create a hash and turn it into the sandboxed context which will be
  // the global context of an application
  const context = {
    module: {},
    require: req,
    api: {
      timers: { setTimeout, setInterval },
      util: api.util,
      console: { log: wrapC(path, console.log) },
    },
  };
  context.global = context;
  const sandbox = api.vm.createContext(context);
  // We need to handle errors here

  // Read an application source code from the file
  api.fs.readFile(path, 'utf-8', (err, data) => {
    if (err) return;
    // Run an application in sandboxed context
    const script = new api.vm.Script(data, path);
    const f = script.runInNewContext(sandbox);

    if (process.argv[2] === path || path === 'application.js') f;
    const exported = sandbox.module.exports;
    const type = typeof exported;
    if (type === 'function') {
      countArgs(exported);
      content(exported);
      exported();
    } else if (type === 'object') {
      console.log(def(exported));
    }
    // We can access a link to exported interface from sandbox.module.exports
    // to execute, save to the cache, print to console, etc.
  });
};

runSandboxed('application.js');

process.on('uncaughtException', err => {
  console.log('Unhandled exception: ' + err);
});
