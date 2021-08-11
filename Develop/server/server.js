const express = require('express');
const path = require('path');
const db = require('./config/connection');
//const routes = require('./routes');

//add Apollo server package
const { ApolloServer } = require('apollo-server-express');
//add typeDefs and resolvers from schema folder
const { typeDefs, resolvers } = require('./schemas');
//import function from utils folder to work with apollo server
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

//Set up server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  //add function as context to pass data to our resolvers
  context: authMiddleware,
});

//apply server to our middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`use graphql at http:localhost:${PORT}${server.graphqlPath}`);
  });
});
