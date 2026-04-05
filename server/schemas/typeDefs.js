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

  type Player {
    playerId: ID!
    name: String!
    number: Int
    position: String
    games: [PlayerGame]
  }

  type PlayerGame {
    gameId: ID!
    playerId: ID!
    date: String
    team1: String
    team2: String
    stats: GameStats
  }

  type Query {
    players: [Player]
    player(playerId: ID!): Player
    playerGames: [PlayerGame]
    playerGame(gameId: ID!): PlayerGame
    playerGamesByPlayer(playerId: ID!): [PlayerGame]
  }

  type Mutation {
    addPlayer(
      name: String!
      number: Int
      position: String
    ): Player

    addPlayerGame(
      playerId: ID!
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

    deletePlayer(playerId: ID!): Player
    deletePlayerGame(gameId: ID!): PlayerGame
  }
`;

module.exports = typeDefs;