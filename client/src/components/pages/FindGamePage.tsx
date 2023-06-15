import React, { useEffect, useState } from 'react';
import GameLobby from './GameLobby';
import axios from 'axios';

interface GameLobby {
  id: number;
  name: string;
  players: number;
}

const JoinGamePage: React.FC = () => {
  const [gameLobbies, setGameLobbies] = useState<GameLobby[]>([]);

  useEffect(() => {
    // Fetch the game lobbies from the server
    const fetchGameLobbies = async () => {
      try {
        const response = await axios.get<GameLobby[]>('/gameLobbies');
        setGameLobbies(response.data);
      } catch (error) {
        console.error('Error fetching game lobbies:', error);
      }
    };

    fetchGameLobbies();
  }, []);

  const handleJoinGame = (gameId: number) => {
    // Handle logic for joining the game
    console.log(`Joining game with ID: ${gameId}`);
  };

  return (
    <div>
      <h1>Join Game</h1>
      {gameLobbies.length > 0 ? (
        <ul>
          {gameLobbies.map((gameLobby) => (
            <li key={gameLobby.id}>
              <h2>{gameLobby.name}</h2>
              <p>Players: {gameLobby.players}</p>
              <button onClick={() => handleJoinGame(gameLobby.id)}>
                Join Game
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No game lobbies available</p>
      )}
    </div>
  );
};

export default JoinGamePage;
