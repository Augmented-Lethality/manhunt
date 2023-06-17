import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SocketContext from '../../contexts/Socket/SocketContext';
import { ButtonToHome } from '../Buttons';
import GameLobby from './GameLobby';


const FindGamePage: React.FC = () => {

  const handleFindGame = (gameId: number) => {
    // join game = go to game lobby view where it shows all the players
    // just logs a made up "gameId" for now.
    console.log(`Joining game with ID: ${gameId}`);
  };

  const { socket, uid, users, games } = useContext(SocketContext).SocketState;

  return (
    <div>
            {Object.keys(games).length > 0 ? (
          <>
            <strong>Available Games:</strong>
            <ul>
              {Object.keys(games).map((host) => (
                <li key={host}>
                  Game ID: {games[host].gameId}, Host: {host}, Users: {games[host].uidList.join(', ')}
                </li>
              ))}
            </ul>
          </>
        ) :
        <p>No game lobbies available</p>}
        <ButtonToHome />
    </div>
  )
};

export default FindGamePage;

// THIS IS CURRENTLY SHOWING ALL ACTIVE GAMES, EVEN IF YOU'RE HOSTING THE GAME IT STILL SHOWS

// type GameLobby = {
//   id: number;
//   gameLobbyName: string;
//   players: number;
// };

  // const [gameLobbies, setGameLobbies] = useState<GameLobby[]>([]);
  // const gameLobbies = [
  //   { id: 1, gameLobbyName: "Alex's Game Lobby", players: 69 },
  //   { id: 2, gameLobbyName: "Alexander's Game Lobby", players: 323 },
  //   { id: 3, gameLobbyName: "Al's Game Lobby", players: 1929 },
  // ];
  // useEffect(() => {
  //   // Fetch the game lobbies from the server
  //   const fetchGameLobbies = async () => {
  //     try {
  //       const response = await axios.get<GameLobby[]>('/gameLobbies');
  //       setGameLobbies(response.data);
  //     } catch (error) {
  //       console.error('Error fetching game lobbies:', error);
  //     }
  //   };

  //   fetchGameLobbies();
  // }, []);