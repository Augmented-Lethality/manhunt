import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonToHome: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/home');
  };

  return (
    <button onClick={ handleClick }>Back Home</button>
  );
};

export default ButtonToHome;
