import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const GET_PLAYERS = gql`
  query GetPlayers {
    players {
      playerId
      name
      number
      position
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

type Notification = {
  message: string;
  type: "success" | "error";
};

const AddPlayerForm: React.FC = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] = useState("");
  const [notification, setNotification] = useState<Notification | null>(null);

  const [addPlayer] = useMutation(ADD_PLAYER, {
    refetchQueries: [{ query: GET_PLAYERS }],
    awaitRefetchQueries: true,
  });

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

      setName("");
      setNumber("");
      setPosition("");

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Failed to add player:", error);
      setNotification({
        message: "Failed to add player. Check console for details.",
        type: "error",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <section className="counter">
      <header>
        <h1>Add Player</h1>
        <p className="text-sm text-neutral-500">
          Create a player before adding game stats.
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
          <input
            className="items-stretch w-full"
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>

        <div className="relative mt-2">
          <button type="submit" className="buttonPrimary">
            Add Player
          </button>

          {notification && (
            <div
              className={`absolute top-[-3rem] left-1/2 transform -translate-x-1/2
                          px-4 py-2 rounded shadow-lg text-white font-semibold
                          transition-all duration-300 ${
                            notification.type === "success"
                              ? "bg-green-500"
                              : "bg-red-500"
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