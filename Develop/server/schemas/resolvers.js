//import models
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    //finds user using context
    me: async (parents, args, context) => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id });

        if (user) {
          return user;
        }
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    //creates a new user with valid login token
    addUser: async (parents, args) => {
      const user = await User.create(args);
      console.log(user);
      const token = signToken(user);

      return { token, user };
    },

    //checks if user has entered correct email and password for log in
    login: async (parents, { email, password }) => {
      const user = await User.findOne({ email });
      if (user) {
        const correctPw = await User.isCorrectPassword(password);

        if (correctPw) {
          let token = signToken(user);

          if (token) {
            return { user, token };
          } else {
            console.error('failed to create token');
          }
        } else {
          throw new AuthenticationError('Invalid profile email or password!');
        }
      } else {
        console.error('failed to find user. check seeds or create this user');
        return;
      }
    },

    // logged in users can add a book to their saved library
    saveBook: async (parents, { bookId, book }, context) => {
      //if user is logged in and has valid jwt then allow functionality
      console.log(bookId, book);
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: bookId },
          {
            $addToSet: { savedBooks: book },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      } //throw error if user isn't logged in
      throw new AuthenticationError('You need to be logged in!');
    },

    // logged in users can remove a book from their saved library
    removeBook: async (parents, { book }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: book } },
          { new: true }
        );
      } //throw error if user isn't logged in
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
