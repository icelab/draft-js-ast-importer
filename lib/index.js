'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Importer
 * @param  {Array} ast Abstract Syntax Tree representing draft-js state
 * @return {ContentState} A draft-js `ContentState` object
 */
function importer(ast) {
  var blocks = (0, _compiler2.default)(ast);
  return _draftJs.ContentState.createFromBlockArray(blocks);
}

exports.default = importer;