const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  type Query {
    me(_id: String): [User]
  }

  # still need mutation type and Auth type
  type Mutation {

  }

  type Auth {
      
  }
`;

module.exports = typeDefs;
