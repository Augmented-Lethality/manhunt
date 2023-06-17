import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import SocketContext from '../contexts/Socket/SocketContext';

type ButtonProps = {
  label: string;
  route: string;
  onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = ({ label, route }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return <button onClick={handleClick}>{label}</button>;
};

export const ButtonToHome: React.FC = () => {
  return <Button label="Home" route="/home" />;
};

export const ButtonToGame: React.FC = () => {
  return <Button label="Game Time" route="/onthehunt" />;
};

export const ButtonToProfile: React.FC = () => {
  return <Button label="Profile" route="/profile" />;
};

export const ButtonToFindGame: React.FC = () => {
  return <Button label="Find a Game" route="/findGame" />;
};

export const ButtonToJoinLobby: React.FC = () => {
  return <Button label="Join this game" route="/lobby" />;
};

export const ButtonToHostGame: React.FC = () => {
  const { CreateGame } = useContext(SocketContext);
  return <Button label="Host a Game" route="/lobby" onClick={CreateGame} />;
};

