'use strict';

var render = function render(compiled, data) {
    return compiled(data, escape);
};
var compile = function compile(str) {
    var tpl = str.replace(/\n/g, '\\n').replace(/<%=([/\s\S]+?)%>/g, function (match, code) {
        // 转义 如果有输出则执行
        return '\' + escape(' + code + ') + \'';
    }).replace(/<%=([/\s\S]+?)%>/g, function (match, code) {
        // 转义 如果还有输出则直接输出
        return '\' + ' + code + ' + \'';
    }).replace(/<%([/\s\S]+?)%>/g, function (match, code) {
        // 转义 代码
        return '\';\n' + code + '\ntpl += \'';
    }).replace(/\'\n/g, '\'').replace(/\n\'/gm, '\'');
    tpl = 'tpl = \'' + tpl + '\';';
    // 转换空行
    tpl = tpl.replace(/''/g, '\'\\n\'');
    tpl = 'var tpl = ""; \nwith (obj || {}) {' + tpl + '}; \nreturn tpl;';
    return new Function('obj', 'escape', tpl);
};

var escape = function escape(html) {
    return String(html).replace(/&(?!w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); // IE不支持单引号转义
};

module.exports = {
    compile: compile,
    render: render
};