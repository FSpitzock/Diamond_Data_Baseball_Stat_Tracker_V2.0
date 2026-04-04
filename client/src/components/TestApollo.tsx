import React, { useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_PLAYER_GAMES = gql`
  query {
    playerGames {
      gameId
      team1
      team2
      stats {
        atBats
        hits
      }
    }
  }
`;

const TestApollo: React.FC = () => {
  const { loading, error, data } = useQuery(GET_PLAYER_GAMES);

  useEffect(() => {
    if (!loading && !error) {
      console.log("🔥 Data from backend:", data.playerGames);
    }
  }, [loading, error, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! Check console.</p>;

  return <p>✅ Connected to backend! Check console.</p>;
};

export default TestApollo;