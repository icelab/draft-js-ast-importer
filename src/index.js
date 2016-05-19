import {ContentState} from 'draft-js'
import compiler from './compiler'

/**
 * Importer
 * @param  {Array} ast Abstract Syntax Tree representing draft-js state
 * @return {ContentState} A draft-js `ContentState` object
 */
function importer (ast) {
  return ContentState.createFromBlockArray(compiler(ast))
}

export default importer
