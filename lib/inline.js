'use strict';

var _require = require('fs'),
    readFileSync = _require.readFileSync;

var _require2 = require('path'),
    parse = _require2.parse,
    join = _require2.join;

var files = {};
var blocks = {};
var extend = '';
var dir = './';

function load(path) {
    return readFileSync(join(dir, path), 'utf8');
}

var inline = function inline(path) {
    dir = parse(path).dir;
    var str = readFileSync(path, 'utf8');
    return parser(str);
};

var parser = function parser(str) {
    var replaced = str.replace(/<%\s+(include.*)\s+%>/g, function (match, code) {
        // 转义include
        var partial = code.split(/\s/)[1];
        if (!files[partial]) {
            files[partial] = load(partial);
        }
        return files[partial];
    }).replace(/<%\s+(extend.*)\s+%>/g, function (match, code) {
        // 转义 extend
        var partial = code.split(/\s/)[1];
        extend = load(partial);
        return '';
    }).replace(/<%#([/\s\S]+?)%>([/\s\S]+?)<%\/([/\s\S]+?)%>/g, function (match, code, content) {
        blocks[code.split(/\s/)[1]] = content;
        return '';
    });
    // 转义配置的block
    var layout = extend.replace(/<%-([/\s\S]+?)%>/g, function (match, code) {
        var key = code.split(/\s/)[1];
        var value = blocks[key];
        if (value) {
            return value;
        }
        return '';
    });

    // 如果有嵌套，则进行循环
    if (layout.match(/<%\s+(include.*)\s+%>/) || layout.match(/<%\s+(extends.*)\s+%>/)) {
        return parser(layout);
    } else {
        return layout;
    }
};

module.exports = {
    inline: inline,
    load: load
};