import {ContentState} from 'draft-js'
import compiler from './compiler'

/**
 * Importer
 * @param  {Array} ast Abstract Syntax Tree representing draft-js state
 * @return {ContentState} A draft-js `ContentState` object
 */
function importer (ast) {
  const blocks = compiler(ast)
  // Ensure we return a valid `ContentState` object whether or not there's
  // any content
  if (blocks.length > 0) {
    return ContentState.createFromBlockArray(blocks)
  } else {
    return ContentState.createFromText('')
  }
}

export default importer
