const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./schemas/resolvers");
const connectDB = require("./config/connection");
require("dotenv").config();

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await connectDB();

  await server.start();

  server.applyMiddleware({
    app,
    path: "/graphql",
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();