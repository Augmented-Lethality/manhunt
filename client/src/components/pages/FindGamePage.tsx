import React, { useEffect, useState, useContext } from 'react';
// import GameLobby from './GameLobby';
import axios from 'axios';

import SocketContext from '../../contexts/Socket/SocketContext';
import { ButtonToHome } from '../Buttons';

// type GameLobby = {
//   id: number;
//   gameLobbyName: string;
//   players: number;
// };

const FindGamePage: React.FC = () => {
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

  // const handleFindGame = (gameId: number) => {
  //   // join game = go to game lobby view where it shows all the players
  //   // just logs a made up "gameId" for now.
  //   console.log(`Joining game with ID: ${gameId}`);
  // };


  // return (
  //   <div>
  //     <h1>Join Game</h1>
  //     {gameLobbies.length > 0 ? (
  //       <ul>
  //         {gameLobbies.map((gameLobby) => (
  //           <li key={gameLobby.id}>
  //             <h2>{gameLobby.gameLobbyName}</h2>
  //             <p>Players: {gameLobby.players}</p>
  //             <button onClick={() => handleFindGame(gameLobby.id)}>
  //               Join Game
  //             </button>
  //           </li>
  //         ))}
  //       </ul>
  //     ) : (
  //       <p>No game lobbies available</p>
  //     )}
  //   </div>
  // );

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
