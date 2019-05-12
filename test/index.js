const {load, inline, compile, render} = require('../src/index.js');

// const text = load('../src/index.js');
// console.log(text);

const str = inline('./index.tpl', 'utf8');
// console.log(str);
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