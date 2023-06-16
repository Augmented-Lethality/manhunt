import React, { useContext } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';

const ButtonCreateRoom: React.FC = () => {
  const { CreateGame } = useContext(SocketContext);


  return (
    <button onClick={ CreateGame }>Create Game</button>
  );
};

export default ButtonCreateRoom;
