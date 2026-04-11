import React, { useMemo, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableCaption,
} from "../components/ui/table";
import logo from "../assets/outlaws-logo.png"; 

type StatValues = {
  atBats: number;
  hits: number;
  singles: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  rbi: number;
  walks: number;
  strikeOuts: number;
};

type PlayerRecord = {
  playerId: string;
  name: string;
  number?: number | null;
  position?: string | null;
  games?: { gameId: string }[];
};

type PlayerGameRecord = {
  gameId: string;
  team1?: string;
  team2?: string;
  player?: {
    playerId: string;
    name: string;
    number?: number | null;
    position?: string | null;
  };
  stats: StatValues;
};

const GET_HOME_DATA = gql`
  query GetHomeData {
    players {
      playerId
      name
      number
      position
      games {
        gameId
      }
    }

    playerGames {
      gameId
      team1
      team2
      player {
        playerId
        name
        number
        position
      }
      stats {
        atBats
        hits
        singles
        doubles
        triples
        homeRuns
        rbi
        walks
        strikeOuts
      }
    }
  }
`;

const DELETE_PLAYER_GAME = gql`
  mutation DeletePlayerGame($gameId: ID!) {
    deletePlayerGame(gameId: $gameId) {
      gameId
    }
  }
`;

const DELETE_PLAYER = gql`
  mutation DeletePlayer($playerId: ID!) {
    deletePlayer(playerId: $playerId) {
      playerId
      name
    }
  }
`;

const Home: React.FC = () => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const navigate = useNavigate();

  const [deletePlayerGame] = useMutation(DELETE_PLAYER_GAME, {
    refetchQueries: [{ query: GET_HOME_DATA }],
    awaitRefetchQueries: true,
  });

  const { loading, error, data } = useQuery(GET_HOME_DATA, {
    fetchPolicy: "cache-and-network",
  });

  const players: PlayerRecord[] = data?.players ?? [];
  const allGames: PlayerGameRecord[] = data?.playerGames ?? [];

  const selectedPlayer = players.find(
    (player) => player.playerId === selectedPlayerId,
  );

  const statsArray: PlayerGameRecord[] = useMemo(() => {
    if (!selectedPlayerId) return allGames;
    return allGames.filter(
      (game) => game.player?.playerId === selectedPlayerId,
    );
  }, [allGames, selectedPlayerId]);

  const labels: { key: keyof StatValues; label: string }[] = [
    { key: "atBats", label: "At Bats" },
    { key: "hits", label: "Hits" },
    { key: "singles", label: "Singles" },
    { key: "doubles", label: "Doubles" },
    { key: "triples", label: "Triples" },
    { key: "homeRuns", label: "Home Runs" },
    { key: "rbi", label: "RBI's" },
    { key: "walks", label: "Walks" },
    { key: "strikeOuts", label: "Strike Outs" },
  ];

  const handleDelete = async (gameId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this game?",
    );

    if (!confirmed) return;

    try {
      await deletePlayerGame({
        variables: { gameId },
      });
    } catch (error) {
      console.error("Failed to delete game:", error);
    }
  };

  const handleEditPlayer = (player: PlayerRecord) => {
    navigate("/AddPlayer", {
      state: {
        editingPlayer: player,
      },
    });
  };

  const handleEdit = (game: PlayerGameRecord) => {
    navigate("/Stats", {
      state: {
        editGame: {
          gameId: game.gameId,
          playerId: game.player?.playerId || "",
          team1: game.team1 || "",
          team2: game.team2 || "",
          stats: game.stats,
        },
      },
    });
  };

  const battingAvg = (hits: number, atBats: number) => {
    if (atBats === 0) return "0.000";
    return (hits / atBats).toFixed(3);
  };

  const totals = labels.reduce(
    (acc, item) => {
      acc[item.key] = statsArray.reduce(
        (sum, stat) => sum + (stat.stats?.[item.key] || 0),
        0,
      );
      return acc;
    },
    {} as Record<keyof StatValues, number>,
  );

  if (loading) {
    return (
      <section className="flex flex-col gap-8">
        <p className="p-6 text-xl">Loading home page...</p>
      </section>
    );
  }

  if (error) {
    console.error("Failed to load home data:", error);
    return (
      <section className="flex flex-col gap-8">
        <p className="p-6 text-xl">Error loading home page.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-4">
              <img
                src={logo}
                alt="Oviedo Outlaws 9U"
                className="w-16 h-16 rounded-lg border bg-white p-1 shadow-sm"
              />

              <div className="text-left">
                <h2 className="text-3xl font-bold">Oviedo Outlaws 9U</h2>
                <p className="text-sm text-neutral-500">
                  Team roster and player performance overview.
                </p>
              </div>
            </div>

          {selectedPlayerId && (
            <button
              className="buttonPrimary"
              onClick={() => setSelectedPlayerId("")}
            >
              Show All Players
            </button>
          )}
        </div>

        {!players.length ? (
          <p className="p-4 text-lg">No players added yet.</p>
        ) : (
          <Table className="roster-table">
            <TableCaption>Your current team roster</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>#</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Games</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {players.map((player) => {
                const isSelected = selectedPlayerId === player.playerId;

                return (
                  <TableRow
                    key={player.playerId}
                    className={`${isSelected ? "bg-gray-100 font-semibold" : ""}`}
                  >
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => setSelectedPlayerId(player.playerId)}
                    >
                      {player.name}
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => setSelectedPlayerId(player.playerId)}
                    >
                      {player.number ?? "-"}
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => setSelectedPlayerId(player.playerId)}
                    >
                      {player.position || "-"}
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => setSelectedPlayerId(player.playerId)}
                    >
                      {player.games?.length ?? 0}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          className="iconButton"
                          onClick={() => handleEditPlayer(player)}
                        >
                          Edit
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {selectedPlayer
              ? `${selectedPlayer.name} Stats`
              : "Oviedo Outlaws 9U Overview"}
          </h2>
          <p className="text-sm text-neutral-500">
            {selectedPlayer
              ? `Showing games and totals for ${selectedPlayer.name}.`
              : "Showing totals across all players."}
          </p>
        </div>

        <div className="grid gap-3 rounded-xl border bg-white p-4 shadow-sm md:grid-cols-3">
          {selectedPlayer ? (
            <>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Player
                </p>
                <p className="text-base font-semibold text-neutral-900">
                  {selectedPlayer.name}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Position
                </p>
                <p className="text-base font-semibold text-neutral-900">
                  {selectedPlayer.position || "Not listed"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Games Played
                </p>
                <p className="text-base font-semibold text-neutral-900">
                  {selectedPlayer.games?.length ?? 0}
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Team
                </p>
                <p className="text-base font-semibold text-neutral-900">
                  Oviedo Outlaws 9U
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Players
                </p>
                <p className="text-base font-semibold text-neutral-900">
                  {players.length}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  View
                </p>
                <p className="text-base font-semibold text-neutral-900">
                  All Team Stats
                </p>
              </div>
            </>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              At Bats
            </p>
            <p className="mt-2 text-3xl font-semibold text-neutral-900">
              {totals.atBats}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              Hits
            </p>
            <p className="mt-2 text-3xl font-semibold text-neutral-900">
              {totals.hits}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              Batting Avg
            </p>
            <p className="mt-2 text-3xl font-semibold text-neutral-900">
              {battingAvg(totals.hits, totals.atBats)}
            </p>
          </div>
        </div>

        {!statsArray.length ? (
          <p className="p-6 text-xl">
            {selectedPlayer
              ? `No saved stats yet for ${selectedPlayer.name}.`
              : "No saved stats yet."}
          </p>
        ) : (
          <Table>
            <TableCaption>
              {selectedPlayer
                ? `${selectedPlayer.name}'s saved baseball stats`
                : "All saved baseball stats"}
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Opponent</TableHead>
                {labels.map((item) => (
                  <TableHead key={item.key}>{item.label}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {statsArray.map((stat) => (
                <TableRow key={stat.gameId}>
                  <TableCell>{stat.player?.name || "-"}</TableCell>
                  <TableCell>{stat.team2 || "-"}</TableCell>

                  {labels.map((item) => (
                    <TableCell key={item.key}>{stat.stats[item.key]}</TableCell>
                  ))}

                  <TableCell>
                    <button
                      className="iconButton"
                      onClick={() => handleEdit(stat)}
                    >
                      Edit
                    </button>
                    <button
                      className="iconButton-destructive"
                      onClick={() => handleDelete(stat.gameId)}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}

              <TableRow className="font-bold bg-gray-100">
                <TableCell></TableCell>
                <TableCell>Totals</TableCell>
                {labels.map((item) => (
                  <TableCell key={item.key}>{totals[item.key]}</TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </section>
    </section>
  );
};

export default Home;
