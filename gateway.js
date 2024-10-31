const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const cors = require('cors'); 

// Create an instance of ApolloGateway
const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
        subgraphs: [
            {
                name: 'Authors',
                url: 'http://localhost:4001/graphql',
            },
            {
                name: 'Books',
                url: 'http://localhost:4002/graphql',
            }
        ],
    }),
});

// Create an instance of ApolloServer
const server = new ApolloServer({
    gateway,
    subscriptions: false, 
});

async function startServer() {
    const app = express();
    
    app.use(cors()); 
    app.use(express.json()); 
    
    // Start the Apollo Server
    await server.start();

    // Apply Apollo middleware to the Express app
    app.use('/graphql', expressMiddleware(server)); 

    // Start the Express server
    const port = 4000;
    app.listen(port, () => {
        console.log(`🚀 Gateway ready at http://localhost:${port}/graphql`);
    });
}

startServer().catch(error => {
    console.error('Error starting gateway server:', error);
});
