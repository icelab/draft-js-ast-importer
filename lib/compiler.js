'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flatten = require('./flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _camelCase = require('./camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _dataSchema = require('./dataSchema');

var _dataSchema2 = _interopRequireDefault(_dataSchema);

var _immutable = require('immutable');

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Compiler
 */
function compiler(ast) {
  var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  /**
   * Create an empty ContentState object
   */
  var entityContentState = _draftJs.ContentState.createFromText('');

  /**
   * Called for each node in the abstract syntax tree (AST) that makes up the
   * state contained in the store. We identify the node by `type`
   *
   * @param  {Array} Array representing a single node from the AST
   * @param  {Boolean} first Is the first item in the AST?
   * @param  {Boolean} last Is the last item in the AST?
   *
   * @return {Array} Result of the visit/render
   */
  function visit(node, opts) {
    var type = node[0];
    var content = node[1];
    var visitMethod = 'visit' + (0, _camelCase2.default)(type, true);
    return destinations[visitMethod](content, opts);
  }

  /**
   * A reference object so we can call our dynamic functions in `visit`
   * @type {Object}
   */
  var destinations = {

    /**
     * Called for each node that identifies as a 'block'. Identifies the block
     * _type_ function from the `renderers`
     *
     * @param  {Array} Array representing a single block node from the AST
     * @param  {Boolean} first Is the first item in the AST?
     * @param  {Boolean} last Is the last item in the AST?
     *
     * @return {Function} Result of the relevant `renderers.block[type]`
     * function
     */

    visitBlock: function visitBlock(node, opts) {
      var childBlocks = [];
      var depth = opts.depth || 0;
      var type = node[_dataSchema2.default.block.type];
      var children = node[_dataSchema2.default.block.children];
      var data = (0, _immutable.Map)(node[_dataSchema2.default.block.data]);

      // Build up block content
      var text = '';
      var characterList = (0, _immutable.List)();

      children.forEach(function (child) {
        var type = child[0];
        var childData = visit(child, { depth: depth + 1 });
        // Nested blocks will be added to the `blocks` array
        // when visited
        if (type === 'block') {
          childBlocks.push(childData);
        } else {
          // Combine the text and the character list
          text = text + childData.text;
          characterList = characterList.concat(childData.characterList);
        }
      });

      var contentBlock = new _draftJs.ContentBlock({
        key: (0, _draftJs.genKey)(),
        text: text,
        type: type,
        characterList: characterList,
        depth: depth,
        data: data
      });

      return [contentBlock, childBlocks];
    },


    /**
     * Called for each node that identifies as a 'entity'. Identifies the
     * entity _type_ function from the `renderers`
     *
     * @param  {Array} Array representing a single entity node from the AST
     * @param  {Boolean} first Is the first item in the AST?
     * @param  {Boolean} last Is the last item in the AST?
     *
     * @return {Function} Result of the relevant `renderers.entity[type]`
     * function
     */
    visitEntity: function visitEntity(node) {
      var type = node[_dataSchema2.default.entity.type];
      var mutability = node[_dataSchema2.default.entity.mutability];
      var data = node[_dataSchema2.default.entity.data];
      var children = node[_dataSchema2.default.entity.children];

      // Create the entity and note its key
      // run over all the children and aggregate them into the
      // format we need for the final parent block
      entityContentState = entityContentState.createEntity(type, mutability, data);
      var entityKey = entityContentState.getLastCreatedEntityKey();
      var text = '';
      var characterList = (0, _immutable.List)();

      children.forEach(function (child) {
        var childData = visit(child, { entityKey: entityKey });
        // Combine the text and the character list
        text = text + childData.text;
        characterList = characterList.concat(childData.characterList);
      });

      return {
        text: text,
        characterList: characterList
      };
    },


    /**
     * Called for each node that identifies as a 'inline'. Identifies the
     * entity _type_ function from the `renderers`
     *
     * @param  {Array} Array representing a single inline node from the AST
     * @param  {Boolean} first Is the first item in the AST?
     * @param  {Boolean} last Is the last item in the AST?
     *
     * @return {Function} Result of the relevant `renderers.inline[type]`
     * function
     */
    visitInline: function visitInline(node) {
      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var styles = node[_dataSchema2.default.inline.styles];
      var text = node[_dataSchema2.default.inline.text];

      // Convert the styles into an OrderedSet
      var style = (0, _immutable.OrderedSet)(styles.map(function (style) {
        return style;
      }));

      // Create a List that has the style values for each character
      var charMetadata = _draftJs.CharacterMetadata.create({
        style: style,
        entity: opts.entityKey || null
      });

      // We want the styles to apply to the entire range of `text`
      var characterMeta = (0, _immutable.Repeat)(charMetadata, text.length);

      var characterList = characterMeta.toList();

      return {
        text: text,
        characterList: characterList
      };
    }
  };

  if (ast.length > 0) {
    // Procedurally visit each node
    var blocks = (0, _flatten2.default)(ast.map(visit));
    // Build a valid ContentState that combines the blocks and the entity map
    // from the entityContentState
    return _draftJs.ContentState.createFromBlockArray(blocks, entityContentState.getEntityMap());
  } else {
    return _draftJs.ContentState.createFromText('');
  }
}

exports.default = compiler;