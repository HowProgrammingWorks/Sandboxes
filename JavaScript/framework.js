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

const compareSandboxes = (beforeSandbox, afterSandbox) => {
  for (const key in beforeSandbox) {
    if (key in afterSandbox) continue;
    else return false;
  }
  for (const key in afterSandbox) {
    if (key in beforeSandbox) continue;
    else return false;
  }
  return true;
}

const printFnInfo = (fn) => {
  console.log(`Function parameter: ${fn.length}, source: ${fn.toString()}`);
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
const sandboxBefore = Object.assign({}, sandbox);

const api = { timers,  events };

fs.readFile(fileName, 'utf8', (err, src) => {
  src = `api => { ${src} };`;
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
    f(api);
    const sandboxAfter = Object.assign({}, sandbox);
    console.log(compareSandboxes(sandboxBefore, sandboxAfter));
    const exported = sandbox.module.exports;
    console.dir({ exported });
    printFnInfo(exported.fn);
  } catch (e) {
    console.dir(e);
    console.log('Execution timeout');
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.log('Unhandled exception: ' + err);
});
