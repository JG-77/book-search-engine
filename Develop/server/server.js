const express = require('express');
const path = require('path');
//add Apollo server package
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection');
const routes = require('./routes');
//add typeDefs and resolvers from schema folder
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

//Set up server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//apply server to our middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
