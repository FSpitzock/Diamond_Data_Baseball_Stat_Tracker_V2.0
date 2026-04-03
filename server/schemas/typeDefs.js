const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type GameStats {
    atBats: Int
    hits: Int
    singles: Int
    doubles: Int
    triples: Int
    homeRuns: Int
    rbi: Int
    walks: Int
    strikeOuts: Int
  }

  type PlayerGame {
    gameId: ID!
    date: String
    team1: String
    team2: String
    stats: GameStats
  }

  type Query {
    playerGames: [PlayerGame]
    playerGame(gameId: ID!): PlayerGame
  }

  type Mutation {
    addPlayerGame(
      team1: String
      team2: String
      atBats: Int
      hits: Int
      singles: Int
      doubles: Int
      triples: Int
      homeRuns: Int
      rbi: Int
      walks: Int
      strikeOuts: Int
    ): PlayerGame

    deletePlayerGame(gameId: ID!): PlayerGame
  }
`;

module.exports = typeDefs;