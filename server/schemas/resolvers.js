const { AuthenticationError } = require ('apollo-server-express');

const { User } = require('../models');
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, args, context, info) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                
                return userData;
            }

            throw new AuthenticationError("You are not logged in")
        },
    },

    Mutation: {
        createUser: async (parent, args, context, info) => {
            const user = await User.create(args);
            const token = signToken(user)

            return { token, user };
        },
        login: async(parent, { email, password }, context, info) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError('Wrong credetials!')
            }

            const correctPassword = await user.isCorrectPassword(password);
            
            if(!correctPassword) {
                throw new AuthenticationError('Wrong credentials!')
            }
            
            const token = signToken(user);
            return { token, user};
        },
        saveBook: async(parent, { bookData }, context) => {
            if (context.user) {
                const updateUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData }},
                    { new: true }
                );
                return updateUser
            }

             throw new AuthenticationError('You must be logged in');
        },
        deleteBook: async (parent, { bookId }, context, info) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updateUser
            }

            throw new AuthenticationError('You must be logged in');
        },
    },
};

module. exports = resolvers;