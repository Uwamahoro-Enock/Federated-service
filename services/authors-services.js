const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const mongoose = require('mongoose');
const { buildSubgraphSchema } = require('@apollo/subgraph'); 
const typeDefs = require('../schema/typeDefs'); 
const resolvers = require('../schema/resolvers'); 
const cors = require('cors'); // Add this line


const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://enockdev01:9ZSj0QkXhEMyRCzu@cluster0.as0jw.mongodb.net/Ironjils?retryWrites=true", {});
mongoose.connection.once('open', () => {
    console.log('Connected to authors database');
});

// Set up Apollo Server with the subgraph schema
const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]), // Use buildSubgraphSchema with typeDefs and resolvers
});

// Create an async function to start the server
async function startServer() {
    // Start the Apollo Server
    await server.start();

    app.use(cors("*")); 


    // Apply the Apollo middleware
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => ({
            headers: req.headers
        })
    }));

    app.listen(4001, () => {
        console.log('Authors service running at http://localhost:4001/graphql');
    });
}

startServer().catch(error => {
    console.error('Error starting server:', error);
});
