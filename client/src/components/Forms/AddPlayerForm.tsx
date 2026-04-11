import React, { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

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

const ADD_PLAYER = gql`
  mutation AddPlayer($name: String!, $number: Int, $position: String) {
    addPlayer(name: $name, number: $number, position: $position) {
      playerId
      name
      number
      position
    }
  }
`;

const UPDATE_PLAYER = gql`
  mutation UpdatePlayer(
    $playerId: ID!
    $name: String!
    $number: Int
    $position: String
  ) {
    updatePlayer(
      playerId: $playerId
      name: $name
      number: $number
      position: $position
    ) {
      playerId
      name
      number
      position
    }
  }
`;

const DELETE_PLAYER = gql`
  mutation DeletePlayer($playerId: ID!) {
    deletePlayer(playerId: $playerId) {
      playerId
    }
  }
`;

const positionOptions = [
  "",
  "Pitcher",
  "Catcher",
  "First Base",
  "Second Base",
  "Third Base",
  "Shortstop",
  "Left Field",
  "Center Field",
  "Right Field",
  "Designated Hitter",
  "Utility",
];

type Notification = {
  message: string;
  type: "success" | "error";
};

type EditablePlayer = {
  playerId: string;
  name: string;
  number?: number | null;
  position?: string | null;
} | null;

type AddPlayerFormProps = {
  editingPlayer: EditablePlayer;
  onCancelEdit: () => void;
};

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({
  editingPlayer,
  onCancelEdit,
}) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] = useState("");
  const [notification, setNotification] = useState<Notification | null>(null);

  const [addPlayer] = useMutation(ADD_PLAYER, {
    refetchQueries: [{ query: GET_HOME_DATA }],
    awaitRefetchQueries: true,
  });

  const [updatePlayer] = useMutation(UPDATE_PLAYER, {
    refetchQueries: [{ query: GET_HOME_DATA }],
    awaitRefetchQueries: true,
  });

  const [deletePlayer] = useMutation(DELETE_PLAYER, {
    refetchQueries: [{ query: GET_HOME_DATA }],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    if (editingPlayer) {
      setName(editingPlayer.name || "");
      setNumber(
        editingPlayer.number !== null && editingPlayer.number !== undefined
          ? String(editingPlayer.number)
          : "",
      );
      setPosition(editingPlayer.position || "");
    } else {
      setName("");
      setNumber("");
      setPosition("");
    }
  }, [editingPlayer]);

  const resetForm = () => {
    setName("");
    setNumber("");
    setPosition("");
    setNotification(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNotification({
        message: "Player name is required.",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      if (editingPlayer) {
        await updatePlayer({
          variables: {
            playerId: editingPlayer.playerId,
            name: name.trim(),
            number: number.trim() ? parseInt(number, 10) : null,
            position: position.trim(),
          },
        });

        setNotification({
          message: "✏️ Player updated successfully!",
          type: "success",
        });

        setTimeout(() => {
          resetForm();
          onCancelEdit();
        }, 2000);

        return;
      }

      await addPlayer({
        variables: {
          name: name.trim(),
          number: number.trim() ? parseInt(number, 10) : null,
          position: position.trim(),
        },
      });

      setNotification({
        message: "✅ Player added successfully!",
        type: "success",
      });

      resetForm();

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Failed to save player:", error);

      setNotification({
        message: "Failed to save player. Check console for details.",
        type: "error",
      });

      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDeletePlayer = async () => {
    if (!editingPlayer) return;

    const confirmed = window.confirm(
      `Delete ${editingPlayer.name}? This will also delete all saved games.`,
    );

    if (!confirmed) return;

    try {
      await deletePlayer({
        variables: {
          playerId: editingPlayer.playerId,
        },
      });

      setNotification({
        message: "🗑️ Player deleted successfully!",
        type: "success",
      });

      setTimeout(() => {
        resetForm();
        onCancelEdit();
      }, 1500);
    } catch (error) {
      console.error("Failed to delete player:", error);

      setNotification({
        message: "Failed to delete player.",
        type: "error",
      });

      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <section className="counter">
      <header>
        <h1>{editingPlayer ? "Edit Player" : "Add Player"}</h1>
        <p className="text-sm text-neutral-500">
          {editingPlayer
            ? "Update the selected player's information."
            : "Create a player before adding game stats."}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            className="items-stretch w-full"
            type="text"
            placeholder="Player Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <input
            className="items-stretch w-full"
            type="number"
            placeholder="Jersey Number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>

        <div>
          <select
            className="items-stretch w-full"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="">Select Position</option>
            {positionOptions
              .filter((p) => p !== "")
              .map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
          </select>
        </div>

        <div className="relative mt-2 flex gap-3">
          <button type="submit" className="buttonPrimary">
            {editingPlayer ? "Update Player" : "Add Player"}
          </button>

          {editingPlayer && (
            <>
              <button
                type="button"
                className="iconButton"
                onClick={() => {
                  resetForm();
                  onCancelEdit();
                }}
              >
                Cancel Edit
              </button>

              <button
                type="button"
                className="iconButton-destructive"
                onClick={handleDeletePlayer}
              >
                Delete Player
              </button>
            </>
          )}

          {notification && (
            <div
              className={`absolute top-[-3rem] left-1/2 transform -translate-x-1/2
      px-4 py-2 rounded shadow-lg text-white font-semibold
      transition-all duration-300 ${
        notification.type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
            >
              {notification.message}
            </div>
          )}
        </div>
      </form>
    </section>
  );
};

export default AddPlayerForm;
