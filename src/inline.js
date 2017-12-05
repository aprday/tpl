const path = require('path');
const fs = require('fs');
let DIR = './'

const inline = function (root) {
    DIR = path.parse(root).dir;
    let str = fs.readFileSync(root, 'utf8');
    str = parser(str, DIR)
    return str;
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

module.exports = {
    inline
};