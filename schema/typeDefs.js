const { gql } = require('graphql-tag');

const typeDefs = gql`
    # Federation directives
    type Query {
        author(id: ID!): Author
        authors: [Author]
        books: [Book]  # Add books query
        book(id: ID!): Book  # Add book query
    }

    type Mutation {
        addAuthor(name: String!, age: Int!): Author
        addBook(name: String!, genre: String!, authorId: ID!): Book
    }

    type Author @key(fields: "id") {
        id: ID!
        name: String!
        age: Int!
        books: [Book]
    }

    type Book @key(fields: "id") {  # Add @key directive for federation
        id: ID!
        name: String!
        genre: String!
        authorId: ID!
        author: Author @provides(fields: "id")  # Provide author reference
    }
`;

module.exports = typeDefs;
