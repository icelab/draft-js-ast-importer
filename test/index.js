import test from 'tape'
import {
  convertToRaw,
  EditorState,
} from 'draft-js'
import importer from '../src'

// Fixtures
import removeBlockKeys from './fixtures/remove-block-keys'
import contentRaw from './fixtures/content/raw'
import contentAST from './fixtures/content/ast'
import depthRaw from './fixtures/depth/raw'
import depthAST from './fixtures/depth/ast'

test('it should export data', (nest) => {
  nest.test('... to a draft-js `ContentState` instance', (assert) => {
    const contentState = importer(depthAST)
    assert.ok(contentState.getBlockMap != null, 'Has correct instance method')
    assert.end()
  })

  nest.test('... that can be converted to a draft-js raw format', (assert) => {
    const contentState = importer(contentAST)
    const actual = removeBlockKeys(
      convertToRaw(contentState)
    )
    const expected = removeBlockKeys(contentRaw)
    assert.deepEqual(
      actual,
      expected,
      'converted data matches'
    )
    assert.end()
  })

  nest.test('... handles depth correctly', (assert) => {
    const contentState = importer(depthAST)
    const actual = removeBlockKeys(
      convertToRaw(contentState)
    )
    const expected = removeBlockKeys(depthRaw)
    assert.deepEqual(
      actual,
      expected,
      'converted data includes correct nested depth values'
    )
    assert.end()
  })
})
