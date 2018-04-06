/* eslint-disable no-console */

'use strict'

const highlightStack = require('@bmp/highlight-stack')
const chalk = require('chalk')

function extractLocation () {
  const obj = {}
  Error.captureStackTrace(obj)
  const str = obj.stack.split(/\n\s*/)[3]
  const cwd = process.cwd()

  if (str.includes(cwd)) {
    return str.slice(str.indexOf(cwd) + cwd.length + 1, -1)
  }

  return str.slice(str.indexOf('(') + 1, -1)
}

module.exports = ({ obj = console, log, dir, error } = {}) => {
  if (log) {
    obj.__log = obj.log

    obj.log = function (...args) {
      const location = extractLocation()

      if (!location.includes('node_modules')) {
        console.__log(chalk.grey(location))
      }

      console.__log(...args)
    }
  }

  if (dir) {
    obj.__dir = obj.dir

    obj.dir = function (obj, options) {
      console.__log(chalk.grey(extractLocation()))
      console.__dir(obj, Object.assign({
        colors: true,
      }, options))
    }
  }

  if (error) {
    obj.__error = obj.error

    obj.error = function (err, ...args) {
      if (err.stack) {
        console.__error(highlightStack(err.stack))
      } else {
        console.__error(err, ...args)
      }
    }
  }
}
