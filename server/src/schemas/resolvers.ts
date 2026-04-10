import { Player, PlayerGame, User } from "../models";
import { signToken } from "../utils/auth";

interface AuthUser {
  _id: string;
  username: string;
  email: string;
}

interface GraphQLContext {
  user?: AuthUser;
}

interface PlayerArgs {
  playerId: string;
}

interface GameArgs {
  gameId: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}

interface PlayerInputArgs {
  playerId: string;
  name: string;
  number?: number;
  position?: string;
}

interface PlayerGameInputArgs {
  gameId?: string;
  playerId: string;
  team1?: string;
  team2?: string;
  atBats?: number;
  hits?: number;
  singles?: number;
  doubles?: number;
  triples?: number;
  homeRuns?: number;
  rbi?: number;
  walks?: number;
  strikeOuts?: number;
}

const resolvers = {
  Query: {
    players: async () => {
      return await Player.find();
    },

    player: async (_parent: unknown, { playerId }: PlayerArgs) => {
      return await Player.findById(playerId);
    },

    playerGames: async () => {
      return await PlayerGame.find().populate("playerId");
    },

    playerGame: async (_parent: unknown, { gameId }: GameArgs) => {
      return await PlayerGame.findById(gameId).populate("playerId");
    },

    playerGamesByPlayer: async (
      _parent: unknown,
      { playerId }: PlayerArgs
    ) => {
      return await PlayerGame.find({ playerId }).populate("playerId");
    },

    me: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return await User.findById(context.user._id);
    },
  },

  Player: {
    playerId: (parent: any) => parent._id.toString(),

    games: async (parent: any) => {
      return await PlayerGame.find({ playerId: parent._id });
    },
  },

  PlayerGame: {
    gameId: (parent: any) => parent._id.toString(),

    playerId: (parent: any) =>
      parent.playerId && parent.playerId._id
        ? parent.playerId._id.toString()
        : parent.playerId.toString(),

    player: async (parent: any) => {
      if (parent.playerId && parent.playerId.name) {
        return parent.playerId;
      }

      return await Player.findById(parent.playerId);
    },
  },

  Mutation: {
    addUser: async (_parent: unknown, { username, email, password }: AddUserArgs) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },

    login: async (_parent: unknown, { email, password }: LoginArgs) => {
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

    addPlayer: async (
      _parent: unknown,
      args: Omit<PlayerInputArgs, "playerId">,
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return await Player.create({
        name: args.name,
        number: args.number,
        position: args.position,
      });
    },

    updatePlayer: async (
      _parent: unknown,
      args: PlayerInputArgs,
      context: GraphQLContext
    ) => {
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
        { new: true }
      );

      if (!updatedPlayer) {
        throw new Error("Player not found.");
      }

      return updatedPlayer;
    },

    addPlayerGame: async (
      _parent: unknown,
      args: PlayerGameInputArgs,
      context: GraphQLContext
    ) => {
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

    updatePlayerGame: async (
      _parent: unknown,
      args: PlayerGameInputArgs,
      context: GraphQLContext
    ) => {
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
        { new: true }
      );

      if (!updatedGame) {
        throw new Error("Game not found.");
      }

      return updatedGame;
    },

    deletePlayer: async (
      _parent: unknown,
      { playerId }: PlayerArgs,
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      await PlayerGame.deleteMany({ playerId });
      return await Player.findByIdAndDelete(playerId);
    },

    deletePlayerGame: async (
      _parent: unknown,
      { gameId }: GameArgs,
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return await PlayerGame.findByIdAndDelete(gameId);
    },
  },
};

export default resolvers;