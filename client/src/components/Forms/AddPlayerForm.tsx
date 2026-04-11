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

  const showNotification = (
    message: string,
    type: "success" | "error",
    duration = 3000,
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showNotification("Player name is required.", "error");
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

        showNotification("✏️ Player updated successfully!", "success", 2000);

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

      showNotification("✅ Player added successfully!", "success");
      resetForm();
    } catch (error) {
      console.error("Failed to save player:", error);
      showNotification(
        "Failed to save player. Check console for details.",
        "error",
        5000,
      );
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

      showNotification("🗑️ Player deleted successfully!", "success", 1500);

      setTimeout(() => {
        resetForm();
        onCancelEdit();
      }, 1500);
    } catch (error) {
      console.error("Failed to delete player:", error);
      showNotification("Failed to delete player.", "error", 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="player-form">
      {notification && (
        <div
          className={`form-notification ${
            notification.type === "success"
              ? "form-notification-success"
              : "form-notification-error"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="playerName">Player Name</label>
        <input
          id="playerName"
          className="form-input"
          type="text"
          placeholder="Enter player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="jerseyNumber">Jersey Number</label>
        <input
          id="jerseyNumber"
          className="form-input"
          type="number"
          placeholder="Enter jersey number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="position">Position</label>
        <select
          id="position"
          className="form-input"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          <option value="">Select position</option>
          {positionOptions
            .filter((p) => p !== "")
            .map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="buttonPrimary">
          {editingPlayer ? "Update Player" : "Add Player"}
        </button>

        {editingPlayer && (
          <>
            <button
              type="button"
              className="buttonSecondary"
              onClick={() => {
                resetForm();
                onCancelEdit();
              }}
            >
              Cancel Edit
            </button>

            <button
              type="button"
              className="buttonDanger"
              onClick={handleDeletePlayer}
            >
              Delete Player
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default AddPlayerForm;