import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonToLobby: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/lobby');
  };

  return <button onClick={handleClick}>Game Lobby</button>;
};

export default ButtonToLobby;
