const path = require('path');
const fs = require('fs');
const process = require('process');
let DIR = './'

const inline = function (root) {
    DIR = path.parse(root).dir;
    let str = fs.readFileSync(root, 'utf8');
    return str;
}
const render = function (compiled, data) {
    return compiled(data, escape);
}
const compile = function (str) {
    str = parser(str, DIR);
    let tpl = str.replace(/\n/g, '\\n')
    .replace(/<%=([/\s\S]+?)%>/g, function (match, code) {
        // 转义
        return `' + escape(${code}) + '`;
    })
    .replace(/<%-([/\s\S]+?)%>/g, function (match, code) {
        // 转义
        return `' + ${code} + '`;
    })
    .replace(/<%([/\s\S]+?)%>/g, function (match, code) {
        // 转义
        return `';\n${code}\ntpl += '`;
    })
    .replace(/\'\n/g, '\'')
    .replace(/\n\'/gm, '\'');
    tpl = `tpl = '${tpl}';`;
    // 转换空行
    tpl = tpl.replace(/''/g, '\'\\n\'');
    tpl = `var tpl = ""; \nwith (obj || {}) {${tpl}}; \nreturn tpl;`;
    return new Function('obj', 'escape', tpl);
}

const parser = function (str, dir) {
    let file = '';
    const replaced = str.replace(/<%\s+(include[^<%]+)\s+%>/g, function (match, code) {
        const partial = code.split(/\s/)[1];
        return fs.readFileSync(path.join(dir, partial), 'utf8');
    }).replace(/<%\s+(extends[^<%]+)\s+%>/g, function (match, code) {
        const partial = code.split(/\s/)[1];
        file = fs.readFileSync(path.join(dir, partial), 'utf8');
        return '';
    });
    const layout = file.replace(/<%-\s*body\s*%>/g, function (match, code) {
        return replaced
    });

    // 如果有嵌套，则进行循环
    if (layout.match(/<%\s+(include[^<%]+)\s+%>/) || layout.match(/<%\s+(extends[^<%]+)\s+%>/)) {
        return include(layout);
    } else {
        return layout;
    }
};

const escape = function (html) {
    return String(html)
        .replace(/&(?!w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;'); // IE不支持单引号转义
}

module.exports = {
    compile,
    render,
    inline
};