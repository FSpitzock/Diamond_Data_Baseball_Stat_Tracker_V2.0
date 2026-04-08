let players = [];
let playerGames = [];

const resolvers = {
  Query: {
    players: () => players,

    player: (_, { playerId }) =>
      players.find((p) => p.playerId === playerId),

    playerGames: () => playerGames,

    playerGame: (_, { gameId }) =>
      playerGames.find((g) => g.gameId === gameId),

    playerGamesByPlayer: (_, { playerId }) =>
      playerGames.filter((g) => g.playerId === playerId),
  },

  Player: {
    games: (parent) =>
      playerGames.filter((g) => g.playerId === parent.playerId),
  },

  PlayerGame: {
    player: (parent) =>
        players.find((p) => p.playerId === parent.playerId),
},

Mutation: {
  addPlayer: (_, args) => {
    const newPlayer = {
      playerId: String(Date.now()),
      name: args.name,
      number: args.number || null,
      position: args.position || "",
    };

    players.push(newPlayer);
    return newPlayer;
  },

  addPlayerGame: (_, args) => {
    const playerExists = players.find((p) => p.playerId === args.playerId);

    if (!playerExists) {
      throw new Error("Player not found. Create the player first.");
    }

    const newGame = {
      gameId: String(Date.now()),
      playerId: args.playerId,
      date: new Date().toISOString(),
      team1: args.team1 || "",
      team2: args.team2 || "",
      stats: {
        atBats: args.atBats || 0,
        hits: args.hits || 0,
        singles: args.singles || 0,
        doubles: args.doubles || 0,
        triples: args.triples || 0,
        homeRuns: args.homeRuns || 0,
        rbi: args.rbi || 0,
        walks: args.walks || 0,
        strikeOuts: args.strikeOuts || 0,
      },
    };

    playerGames.push(newGame);
    return newGame;
  },

  updatePlayerGame: (_, args) => {
    const index = playerGames.findIndex((g) => g.gameId === args.gameId);

    if (index === -1) {
      throw new Error("Game not found.");
    }

    const playerExists = players.find((p) => p.playerId === args.playerId);

    if (!playerExists) {
      throw new Error("Player not found.");
    }

    const updatedGame = {
      ...playerGames[index],
      playerId: args.playerId,
      team1: args.team1 || "",
      team2: args.team2 || "",
      stats: {
        atBats: args.atBats || 0,
        hits: args.hits || 0,
        singles: args.singles || 0,
        doubles: args.doubles || 0,
        triples: args.triples || 0,
        homeRuns: args.homeRuns || 0,
        rbi: args.rbi || 0,
        walks: args.walks || 0,
        strikeOuts: args.strikeOuts || 0,
      },
    };

    playerGames[index] = updatedGame;
    return updatedGame;
  },

  deletePlayer: (_, { playerId }) => {
    const player = players.find((p) => p.playerId === playerId);
    players = players.filter((p) => p.playerId !== playerId);
    playerGames = playerGames.filter((g) => g.playerId !== playerId);
    return player;
  },

  deletePlayerGame: (_, { gameId }) => {
    const game = playerGames.find((g) => g.gameId === gameId);
    playerGames = playerGames.filter((g) => g.gameId !== gameId);
    return game;
  },
},
};
module.exports = resolvers;