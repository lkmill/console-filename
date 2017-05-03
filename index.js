/* eslint-disable no-console */

'use strict';

const chalk = require('chalk');

console.__log = console.log;
console.__dir = console.dir;

function extractLocation() {
  const obj = {};
  Error.captureStackTrace(obj);
  const str = obj.stack.split(/\n\s*/)[3];
  const cwd = process.cwd();

  if (str.includes(cwd)) {
    return str.slice(str.indexOf(cwd) + cwd.length + 1, -1);
  }

  return str.slice(str.indexOf('(') + 1, -1);
}

console.log = function (...args) {
  const location = extractLocation();

  if (!location.includes('node_modules')) {
    console.__log(chalk.grey(location));
  }

  console.__log(...args);
};

console.dir = function (obj, options) {
  console.__log(chalk.grey(extractLocation()));
  console.__dir(obj, Object.assign({
    colors: true,
  }, options));
};
