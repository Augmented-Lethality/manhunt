import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import SocketContext from '../contexts/Socket/SocketContext';

type ButtonProps = {
  label: string;
  route: string;
};

export const Button: React.FC<ButtonProps> = ({ label, route }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return <button onClick={handleClick}>{label}</button>;
};

export const ButtonToHome: React.FC = () => {
  return <Button label="Back Home" route="/home" />;
};

// export const ButtonToGame: React.FC = () => {
//   return <Button label="Game Time" route="/onthehunt" />;
// };

export const ButtonToProfile: React.FC = () => {
  return <Button label="Profile" route="/profile" />;
};

export const ButtonToFindGame: React.FC = () => {
  return <Button label="Find a Game" route="/findGame" />;
};

export const ButtonHostGame: React.FC = () => {
  const { CreateGame } = useContext(SocketContext);
  const navigate = useNavigate();

  const handleClick = () => {
    CreateGame();
    navigate('/lobby');
  };


  return (
    <button onClick={handleClick}>Host a Game</button>
  );
};
