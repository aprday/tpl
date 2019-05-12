'use strict';

var _require = require('./compile.js'),
    compile = _require.compile,
    render = _require.render;

var _require2 = require('./inline.js'),
    inline = _require2.inline,
    load = _require2.load;

module.exports = {
    compile: compile,
    render: render,
    inline: inline,
    load: load
};