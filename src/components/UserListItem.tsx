import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import SocketContext, { User } from '../contexts/Socket/SocketContext';
import CheckAccess from './GameLobby/CheckAccess';
import AccessReady from './GameLobby/AccessReady';

const UserContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;

const Username = styled.p`
  font-size: 16px;
  color: #000;
`;


const UserListItem: React.FC<{ player: User }> = ({ player }) => {
  const navigate = useNavigate();

  const { ready } = useContext(SocketContext).SocketState;
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (ready[player.authId]) {
      setErrors(ready[player.authId]);
    }
  }, [ready, player.authId]);

  return (
    <UserContainer onClick={() => navigate(`/profile/${player.username}`)}>
      {player.image ? (
        <UserImage src={player.image} alt={player.username} />
      ) : (
        <h1 className='alt-user-pic'>
          <p>{player.username?.slice(0, 1)}</p>
        </h1>
      )}
      <Username>{player.username}</Username><br />
      <AccessReady player={player} errors={errors} />
      <CheckAccess />
    </UserContainer>
  );
};

export default UserListItem;
