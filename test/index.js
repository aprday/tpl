const {inline} = require('../src/inline.js');
const {compile, render} = require('../src/compile.js');

const str = inline('./test/index.tpl', 'utf8');
const compiled = compile(str);
console.log(render(compiled, {
    user: {
        name: 'Jackson Tian'
    },
    items: [{
        name: 'jack'
    }, {
        name: 'sara'
    }]
}));