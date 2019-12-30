'use strict';
// Tests requires
let api;

// Require some modules
require('fs');
require('vm');

// One call to util`s function
const o = { a: 5, b: 6 };
o.self = o;
api.console.log(api.util.inspect(o));

// Using setTimeout and setInterval
// Exporting a function
module.exports = () => {
  api.timers.setTimeout(() => {
    // Print from the exported function context
    api.console.log('setTimeout from application2 exported function');
  }, 5000);

  api.timers.setInterval(() => {
    // Print from the exported function context
    api.console.log('setInterval from application2 exported function');
  }, 2000);
};
/*
// Exporting an onject
const obj = {
  fn1: () => {},
  arr: Array.of({ length: 5 }),
  o: new Object({}),
  str: new String('string').valueOf(),
  //buffer: Buffer.alloc(10),
  bool: new Boolean(false).valueOf(),
};

module.exports = obj;
*/
// List of everything from the global context (application
// sandbox) with the data types specified
const def = obj =>
  Object.keys(obj).reduce(
    (hash, key) => ((hash[key] = typeof obj[key]), hash),
    {}
  );
api.console.log(def(global));
