import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonToGame: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/onthehunt');
  };

  return (
    <button onClick={ handleClick }>Game Time</button>
  );
};

export default ButtonToGame;
