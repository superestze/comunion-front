export * from './erc20'
<% contracts.forEach(function(contract) { %>export * from './<%- contract %>'
<% }) %>