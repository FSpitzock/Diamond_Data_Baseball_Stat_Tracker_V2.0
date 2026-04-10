import { ApolloServer } from "apollo-server-express";
import express, { Application } from "express";
import dotenv from "dotenv";
import path from "path";

import typeDefs from "./schemas/typeDefs";
import resolvers from "./schemas/resolvers";
import connectDB from "./config/connection";
import { authMiddleware } from "./utils/auth";

dotenv.config();

const app: Application = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

async function startServer(): Promise<void> {
  await connectDB();
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  server.applyMiddleware({
    app,
    path: "/graphql",
  });

  const clientBuildPath = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(clientBuildPath));

  app.get(/^(?!\/graphql).*/, (_req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`🚀 Server ready on port ${PORT}`);
    console.log(`📊 GraphQL endpoint available at /graphql`);
  });
}

startServer();