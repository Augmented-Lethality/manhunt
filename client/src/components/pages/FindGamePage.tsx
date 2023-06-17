import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SocketContext from '../../contexts/Socket/SocketContext';
import { ButtonToHome } from '../Buttons';
import GameLobby, { IGameLobbyProps } from './GameLobby';

const FindGamePage: React.FC = () => {
  const { socket, uid, users, games } = useContext(SocketContext).SocketState;


  console.log('GAMES', games, 'USERS', users);

  
  const handle = (gameId: string) => {
    console.log(`Joining game with ID: ${gameId}`);
  };

  return (
    <div>
      
      {Object.keys(games).length > 0 ? (
        <>
          <strong>Available Games:</strong>
          <ul>
            
            {Object.keys(games).map((host) => (
              <li key={host}>
                <GameLobby gameId={games[host].gameId} host={host} uidList={games[host].uidList} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No game lobbies available</p>
      )}
      <ButtonToHome />
      <p>
        Your Socket User ID: <strong>{uid}</strong>
        <br />
        Total Users Active on App: <strong>{users.length}</strong>
        <br />
        Your Socket ID: <strong>{socket?.id}</strong>
        <br />
      </p>
    </div>
  );
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
