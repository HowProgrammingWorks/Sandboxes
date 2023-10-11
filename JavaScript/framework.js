'use strict';

const PARSING_TIMEOUT = 1000;
const EXECUTION_TIMEOUT = 5000;

const fs = require('node:fs');
const vm = require('node:vm');
const timers = require('node:timers');
const events = require('node:events');
const util = require('node:util');

const fileName = process.argv[2];

const editedConsole = Object.assign({}, console);
editedConsole.log = (message) => {
  console.log(`${fileName} : ${new Date().toISOString()} : ${message}`);
}

const context = {
  module: {},
  console: editedConsole,
  setTimeout, setImmediate, util,
  require: (name) => {
    console.log(`${new Date().toISOString()} : ${name}`);
    if (name === 'fs' || name === 'node:fs') {
      console.log('Module fs is restricted');
      return null;
    }
    return require(name);
  }
};

context.global = context;
const sandbox = vm.createContext(context);

// Prepare lambda context injection
const api = { timers,  events };

fs.readFile(fileName, 'utf8', (err, src) => {
  // We need to handle errors here

  // Wrap source to lambda, inject api
  src = `api => { ${src} };`;

  // Run an application in sandboxed context
  let script;
  try {
    script = new vm.Script(src, { timeout: PARSING_TIMEOUT });
  } catch (e) {
    console.dir(e);
    console.log('Parsing timeout');
    process.exit(1);
  }

  try {
    const f = script.runInNewContext(sandbox, { timeout: EXECUTION_TIMEOUT });
    console.log("here", f);
    f(api);
    const exported = sandbox.module.exports;
    console.dir({ exported });
  } catch (e) {
    console.dir(e);
    console.log('Execution timeout');
    process.exit(1);
  }

  // We can access a link to exported interface from sandbox.module.exports
  // to execute, save to the cache, print to console, etc.
});

process.on('uncaughtException', (err) => {
  console.log('Unhandled exception: ' + err);
});
