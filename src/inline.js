const {readFileSync} = require('fs');
const {parse, join} = require('path');

let files = {};
let blocks = {};
let extend = '';
let dir = './';

function load(path) {
    return readFileSync(join(dir, path), 'utf8');
}

const inline = function (path) {
    dir = parse(path).dir;
    const str = readFileSync(path, 'utf8');
    return parser(str);
}

const parser = function (str) {
    const replaced = str.replace(/<%\s+(include.*)\s+%>/g, function (match, code) {
        // 转义include
        const partial = code.split(/\s/)[1];
        if (!files[partial]) {
            files[partial] = load(partial);
        }
        return files[partial];
    }).replace(/<%\s+(extend.*)\s+%>/g, function (match, code) {
        // 转义 extend
        const partial = code.split(/\s/)[1];
        extend = load(partial);
        return '';
    }).replace(/<%#([/\s\S]+?)%>([/\s\S]+?)<%\/([/\s\S]+?)%>/g, function (match, code, content) {
        blocks[code.split(/\s/)[1]] = content;
        return '';
    });
    // 转义配置的block
    const layout = extend.replace(/<%-([/\s\S]+?)%>/g, function (match, code) {
        const key = code.split(/\s/)[1];
        const value = blocks[key];
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
    inline,
    load
};