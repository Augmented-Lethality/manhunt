import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonToFindGame: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/findGame');
  };

  return <button onClick={handleClick}>Find a Game</button>;
};

export default ButtonToFindGame;
