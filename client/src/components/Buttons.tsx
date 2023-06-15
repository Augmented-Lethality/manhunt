import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ButtonToHome: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/home');
  };

  return <button onClick={handleClick}>Back Home</button>;
};

export const ButtonToLobby: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/lobby');
  };

  return <button onClick={handleClick}>Game Lobby</button>;
};

export const ButtonToGame: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/onthehunt');
  };

  return <button onClick={handleClick}>Game Time</button>;
};

export const ButtonToProfile: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/profile');
  };

  return <button onClick={handleClick}>Profile</button>;
};

export const ButtonToFindGame: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/findGame');
  };

  return <button onClick={handleClick}>Find a Game</button>;
};
