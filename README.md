# tpl
跟随20行Javascript代码！手把手教你写一个页面模板引擎制作的项目，对源代码进行了优化和修复bug，使得模板可以跑在浏览器上，目前兼容性良好

### 语法

```
    <% [params] %>
```

支持extend和inclued, 使用方法类似pug.js

```
    <% extends layout.tpl %>
    I am main page
    <% include user.tpl %>
    <% if (user) { %>
        <h2>
            <%= user.name%>
        </h2>
    <% } else { %>
        <h2>匿名用户</h2>
    <% } %>
    <% for (var i = 0; i < items.length; i++) { %>
        <% var item = items[i]; %>
        <p><%= i + 1 %><%= item.name %></p>
    <%}%>
```
### 使用

```
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
```

输出

```
    I am farther
    I am main page
    I am son Jackson Tian
    <h2>
        Jackson Tian
    </h2>
    <p>1 jack</p>
    <p>2 sara</p>
```
