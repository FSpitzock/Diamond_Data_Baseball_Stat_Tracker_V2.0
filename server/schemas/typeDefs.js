const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
  }

  type Auth {
    token: ID!
    user: User
  }

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
    player: Player
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
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth

    addPlayer(name: String!, number: Int, position: String): Player

    updatePlayer(
      playerId: ID!
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

    updatePlayerGame(
      gameId: ID!
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
