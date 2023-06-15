import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonToProfile: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/profile');
  };

  return <button onClick={handleClick}>Profile</button>;
};

export default ButtonToProfile;
