import React from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableCaption,
} from "../components/ui/table";
import { DemoPlayerDetails } from "@/components/ui/playerDetails";
import StatsCard from "@/components/ui/statsCard";
import AddPlayerForm from "../components/Forms/AddPlayerForm";

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

type PlayerGameRecord = {
  gameId: string;
  team2?: string;
  stats: StatValues;
};

const GET_PLAYER_GAMES = gql`
  query GetPlayerGames {
    playerGames {
      gameId
      team2
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

const Home: React.FC = () => {
  const [deletePlayerGame] = useMutation(DELETE_PLAYER_GAME, {
    refetchQueries: [{ query: GET_PLAYER_GAMES }],
    awaitRefetchQueries: true,
  });

  const { loading, error, data } = useQuery(GET_PLAYER_GAMES, {
    fetchPolicy: "cache-and-network",
  });

  const statsArray: PlayerGameRecord[] = data?.playerGames ?? [];

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
      "Are you sure you want to delete this game?"
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

  const battingAvg = (hits: number, atBats: number) => {
    if (atBats === 0) return "0.000";
    return (hits / atBats).toFixed(3);
  };

  if (loading) {
    return (
      <section className="flex flex-col gap-8">
        <AddPlayerForm />
        <p className="p-6 text-xl">Loading stats...</p>
      </section>
    );
  }

  if (error) {
    console.error("Failed to load stats:", error);
    return (
      <section className="flex flex-col gap-8">
        <AddPlayerForm />
        <p className="p-6 text-xl">Error loading stats.</p>
      </section>
    );
  }

  if (!statsArray.length) {
    return (
      <section className="flex flex-col gap-8">
        <AddPlayerForm />
        <p className="p-6 text-xl">No saved stats yet.</p>
      </section>
    );
  }

  const totals = labels.reduce(
    (acc, item) => {
      acc[item.key] = statsArray.reduce(
        (sum, stat) => sum + (stat.stats?.[item.key] || 0),
        0
      );
      return acc;
    },
    {} as Record<keyof StatValues, number>
  );

  return (
    <section className="flex flex-col gap-8">
      <AddPlayerForm />
      <DemoPlayerDetails />

      <div className="flex flex-row mx-auto w-full gap-4 justify-between">
        <StatsCard label={labels[0].label} value={totals[labels[0].key]} />
        <StatsCard label={labels[1].label} value={totals[labels[1].key]} />
        <StatsCard
          label="Batting Avg"
          value={battingAvg(totals.hits, totals.atBats)}
        />
      </div>

      <Table>
        <TableCaption>Your saved baseball stats</TableCaption>
        <TableHeader>
          <TableRow>
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
              <TableCell>{stat.team2 || "-"}</TableCell>

              {labels.map((item) => (
                <TableCell key={item.key}>{stat.stats[item.key]}</TableCell>
              ))}

              <TableCell>
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
            <TableCell>Totals</TableCell>
            {labels.map((item) => (
              <TableCell key={item.key}>{totals[item.key]}</TableCell>
            ))}
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default Home;