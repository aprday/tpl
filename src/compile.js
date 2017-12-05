
const render = function (compiled, data) {
    return compiled(data, escape);
}
const compile = function (str) {
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
    render
};