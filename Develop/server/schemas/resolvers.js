//import models
const { User } = require('../models');
const { authMiddleware, signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parents, args, context) => {
      if (context.user) {
        const user = await User.find({});

        if (user) {
          return user;
        }
      }

      console.log('please login');
    },
  },
  Mutation: {
    addUser: async (parents, args) => {
      const user = await User.create(args);
      console.log(user);
      const token = signToken(user);

      return { token, user };
    },
    //
    login: async (parents, { email, password }) => {
      const user = await User.find({ email });

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
          console.error('wrong password :(');
        }
      } else {
        console.error('failed to find user. check seeds or create this user');
        return;
      }
    },
    saveBook: async (parents, { bookId, book }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: bookId },
          {
            //do I  add all book fields in the object??
            $addToSet: { savedBooks: book },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      } else {
        console.error('failed to find user. check seeds or create this user');
        return;
      }
    },
    // removeBook: async (parents, args) => {},
  },
};

module.exports = resolvers;
