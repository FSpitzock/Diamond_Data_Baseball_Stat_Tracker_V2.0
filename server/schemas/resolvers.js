const { Player, PlayerGame, User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    players: async () => {
      return await Player.find();
    },

    player: async (_, { playerId }) => {
      return await Player.findById(playerId);
    },

    playerGames: async () => {
      return await PlayerGame.find().populate("playerId");
    },

    playerGame: async (_, { gameId }) => {
      return await PlayerGame.findById(gameId).populate("playerId");
    },

    playerGamesByPlayer: async (_, { playerId }) => {
      return await PlayerGame.find({ playerId }).populate("playerId");
    },

    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return await User.findById(context.user._id);
    },
  },

  Player: {
    playerId: (parent) => parent._id.toString(),
    games: async (parent) => {
      return await PlayerGame.find({ playerId: parent._id });
    },
  },

  PlayerGame: {
    gameId: (parent) => parent._id.toString(),
    playerId: (parent) =>
      parent.playerId && parent.playerId._id
        ? parent.playerId._id.toString()
        : parent.playerId.toString(),

    player: async (parent) => {
      if (parent.playerId && parent.playerId.name) {
        return parent.playerId;
      }
      return await Player.findById(parent.playerId);
    },
  },

  Mutation: {
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error("Invalid credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addPlayer: async (_, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      return await Player.create({
        name: args.name,
        number: args.number,
        position: args.position,
      });
    },

    updatePlayer: async (_, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      const updatedPlayer = await Player.findByIdAndUpdate(
        args.playerId,
        {
          name: args.name,
          number: args.number,
          position: args.position,
        },
        { new: true },
      );

      if (!updatedPlayer) {
        throw new Error("Player not found.");
      }

      return updatedPlayer;
    },

    addPlayerGame: async (_, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      const playerExists = await Player.findById(args.playerId);

      if (!playerExists) {
        throw new Error("Player not found. Create the player first.");
      }

      return await PlayerGame.create({
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
      });
    },

    updatePlayerGame: async (_, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      const playerExists = await Player.findById(args.playerId);

      if (!playerExists) {
        throw new Error("Player not found.");
      }

      const updatedGame = await PlayerGame.findByIdAndUpdate(
        args.gameId,
        {
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
        },
        { new: true },
      );

      if (!updatedGame) {
        throw new Error("Game not found.");
      }

      return updatedGame;
    },

    deletePlayer: async (_, { playerId }, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      await PlayerGame.deleteMany({ playerId });
      return await Player.findByIdAndDelete(playerId);
    },

    deletePlayerGame: async (_, { gameId }, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      return await PlayerGame.findByIdAndDelete(gameId);
    },
  },
};

module.exports = resolvers;
