const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { gql } = require('graphql-tag');
const mongoose = require('mongoose');
const Book = require('../collections/books'); // Import the Book model
const Author = require('../collections/authors'); // Import the Author model if needed
const cors = require('cors'); // Import CORS

// Define the GraphQL schema with federation directives
const typeDefs = gql`
    type Book @key(fields: "id") {
        id: ID!
        name: String
        genre: String
        authorId: ID
        author: Author @provides(fields: "id")
    }

    extend type Author @key(fields: "id") {
        id: ID! @external
        name: String @external
        age: Int @external
    }

    type Query {
        books: [Book]
        book(id: ID!): Book
    }

    type Mutation {
    addBook(name: String!, genre: String!, authorId: ID!): Book
    }
`;

// Define resolvers
const resolvers = {
    Book: {
        __resolveReference(book) {
            return Book.findById(book.id);
        },
        author(book) {
            return Author.findById(book.authorId);
        },
        id: (book) => book._id,
    },
    Query: {
        books: () => Book.find(),
        book: (_, { id }) => Book.findById(id),
    },
};

// Connect to MongoDB
mongoose.connect("mongodb+srv://enockdev01:9ZSj0QkXhEMyRCzu@cluster0.as0jw.mongodb.net/Ironjils?retryWrites=true");
mongoose.connection.once('open', () => {
    console.log('Connected to books database');
});

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

const app = express();

// Enable JSON parsing and CORS
app.use(express.json());
app.use(cors("*"));

async function startBooksService() {
    await server.start();
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => ({
            headers: req.headers
        })
    }));

    app.listen(4002, () => {
        console.log(`Books service running at http://localhost:4002/graphql`);
    });
}

startBooksService().catch(error => {
    console.error('Error starting the books service:', error);
});
