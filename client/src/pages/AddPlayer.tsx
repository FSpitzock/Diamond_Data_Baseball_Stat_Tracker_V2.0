import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddPlayerForm from "../components/Forms/AddPlayerForm";
import logo from "../assets/outlaws-logo.png";  


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
  <main className="page-container add-player-page">
    <section className="add-player-hero">

      <img
        src={logo}
        alt="Oviedo Outlaws"
        className="team-logo"
      />

      <p className="page-eyebrow">Oviedo Outlaws 9U</p>

      <h1>{editingPlayer ? "Edit Player" : "Add Player"}</h1>

      <p className="page-description">
        {editingPlayer
          ? "Update this player’s information and keep your roster current."
          : "Create a player profile before adding game stats and tracking performance."}
      </p>
    </section>

    <section className="section-card form-card add-player-card">
      <AddPlayerForm
        editingPlayer={editingPlayer}
        onCancelEdit={() => navigate("/")}
      />
    </section>
  </main>
);
};

export default AddPlayer;