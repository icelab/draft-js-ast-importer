/**
 * Remove the `key` keys/values from the blocks within a draft-js raw object
 * @param  {Object} raw draft-js raw object
 * @return {Object} The passed object sans `key` keys/values
 */
export default function removeBlockKeys (raw) {
  const copy = Object.assign({}, raw)
  copy.blocks.forEach((block) => {
    delete block.key
  })
  return copy
}
