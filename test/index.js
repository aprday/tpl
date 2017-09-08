const tpl = require('../src/index.js');

const str = tpl.inline('./test/index.tpl', 'utf8');
const compiled = tpl.compile(str);
console.log(tpl.render(compiled, {
    user: {
        name: 'Jackson Tian'
    },
    items: [{
        name: 'jack'
    }, {
        name: 'sara'
    }]
}));