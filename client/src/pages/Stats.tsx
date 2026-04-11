import GameStatsForm from "../components/Forms/GameStatsForm";
import logo from "../assets/outlaws-logo.png";

function Stats() {
  return (
    <main className="page-container stats-page">
      <section className="stats-hero">
        <div className="stats-hero-brand">
          <img
            src={logo}
            alt="Oviedo Outlaws"
            className="team-logo"
          />

          <div className="stats-hero-text">
            <p className="page-eyebrow">Oviedo Outlaws 9U</p>
            <h1>Game Stats</h1>
            <p className="page-description">
              Select a player and record stats for today&apos;s game.
            </p>
          </div>
        </div>
      </section>

      <section className="section-card stats-card">
        <GameStatsForm />
      </section>
    </main>
  );
}

export default Stats;