import React from "react";
import AddPlayerForm from "../components/Forms/AddPlayerForm";

const AddPlayer: React.FC = () => {
  return (
    <main className="page-container">
      <section className="page-header">
        <h1>Add Player</h1>
        <p>Create a player before adding game stats.</p>
      </section>

      <section className="section-card form-card">
        <AddPlayerForm />
      </section>
    </main>
  );
};

export default AddPlayer;