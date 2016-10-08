"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Flatten
 * @param  {Array} arr an array with variable depth nesting
 * @return {Array} a flattened array
 */
function flatten(arr) {
  return arr.reduce(function (acc, curr) {
    return acc.concat(Array.isArray(curr) ? flatten(curr) : curr);
  }, []);
}

exports.default = flatten;