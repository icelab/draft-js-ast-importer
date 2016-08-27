/**
 * Flatten
 * @param  {Array} arr an array with variable depth nesting
 * @return {Array} a flattened array
 */
function flatten (arr) {
  return arr.reduce(function(acc, curr) {
    return acc.concat(Array.isArray(curr) ? flatten(curr) : curr);
  }, []);
}

export default flatten
