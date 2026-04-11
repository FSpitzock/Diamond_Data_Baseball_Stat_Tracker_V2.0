import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddPlayerForm from "../components/Forms/AddPlayerForm";

type PlayerRecord = {
  playerId: string;
  name: string;
  number?: number | null;
  position?: string | null;
  games?: { gameId: string }[];
};

const AddPlayer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const editingPlayer = location.state?.editingPlayer as PlayerRecord | null;

  return (
    <main className="page-container">
      <section className="page-header">
        <h1>{editingPlayer ? "Edit Player" : "Add Player"}</h1>
        <p>
          {editingPlayer
            ? "Update this player’s information."
            : "Create a player before adding game stats."}
        </p>
      </section>

      <section className="section-card form-card">
        <AddPlayerForm
          editingPlayer={editingPlayer}
          onCancelEdit={() => navigate("/")}
        />
      </section>
    </main>
  );
};

export default AddPlayer;