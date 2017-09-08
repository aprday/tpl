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