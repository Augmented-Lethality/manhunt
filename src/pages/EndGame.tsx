import React, { useEffect, useState, useContext } from 'react';
import { ButtonToHome } from '../components/Buttons';
import { useAuth0 } from "@auth0/auth0-react";
import SocketContext from '../contexts/Socket/SocketContext';

const EndGame: React.FC = () => {
  const { user } = useAuth0();
  const { games } = useContext(SocketContext).SocketState;
  const [gameOverMessage, setGameOverMessage] = useState('');

  useEffect(() => {
    console.log(user);
    if (games.length > 0) {
      // they won and were not the victim
      if (games[0].winnerId === user?.sub && games[0].hunted !== user?.sub) {
        setGameOverMessage(`Great work, ${user?.name}. You skip tracing gained you your very own bounty.`);

        // INSERT TROPHY COMPONENT

        // they won and were being hunted
      } else if (games[0].winnerId === user?.sub && games[0].hunted === user?.sub) {
        setGameOverMessage(`Why, ${user?.name}, you successfully evaded capture! Go put your feet up and crack open a cold one.`);

        // INSERT TROPHY COMPONENT


        // lost and were being hunted
      } else if (games[0].winnerId !== user?.sub && games[0].hunted === user?.sub) {
        setGameOverMessage(`C'mon ${user?.name}, you seriously let these guys catch you?`);
        // lost and were a hunter
      } else if (games[0].winnerId !== user?.sub && games[0].hunted === user?.sub) {
        setGameOverMessage(`${user?.name}, bounty hunters catch the bounty. Get back in there and try again!`);

      }
    }
  }, [games, user]);


  return (
    <div style={{
      textAlign: 'center',
      padding: '50px',
      backgroundColor: '#fcf18d',
    }}>
      <h1>GAME OVER</h1>
      <h3>{gameOverMessage}</h3>
      <ButtonToHome />
    </div>
  );
};

export default EndGame;