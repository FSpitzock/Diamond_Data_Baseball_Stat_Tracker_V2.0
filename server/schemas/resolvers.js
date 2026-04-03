let playerGames = [];

const resolvers = {
  Query: {
    playerGames: () => playerGames,

    playerGame: (_, { gameId }) =>
      playerGames.find(g => g.gameId === gameId),
  },

  Mutation: {
    addPlayerGame: (_, args) => {
      const newGame = {
        gameId: String(Date.now()),
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

    deletePlayerGame: (_, { gameId }) => {
      const game = playerGames.find(g => g.gameId === gameId);
      playerGames = playerGames.filter(g => g.gameId !== gameId);
      return game;
    },
  },
};

module.exports = resolvers;