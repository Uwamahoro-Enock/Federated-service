const Author = require('../collections/authors');
const Book = require('../collections/books');

const resolvers = {
    Author: {
        __resolveReference(author) {
            return Author.findById(author.id);
        },
        books: async (author) => {
            return await Book.find({ authorId: author.id });
        },
    },
    Book: {
        __resolveReference(book) {
            return Book.findById(book.id);
        },
        author: async (book) => {
            return await Author.findById(book.authorId);
        },
        id: (book) => book._id,
    },
    Query: {
        author: async (_, args) => Author.findById(args.id),
        authors: async () => Author.find({}),
        books: async () => Book.find({}),  // Query to get all books
        book: async (_, { id }) => Book.findById(id),  // Query to get a single book by ID
    },
    Mutation: {
        addAuthor: async (_, args) => {
            const author = new Author({
                name: args.name,
                age: args.age,
            });
            return author.save();
        },
        addBook: async (_, { name, genre, authorId }) => {
            const book = new Book({
                name,
                genre,
                authorId,
            });
            return book.save();
        },
    },
};

module.exports = resolvers;
