import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import SocketContext, { User } from '../contexts/Socket/SocketContext';
import CheckAccess from './GameLobby/CheckAccess';
import AccessReady from './GameLobby/AccessReady';

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 10px;
  margin-top: 15px;
  border: 2px solid cyan;
`;

const UserImage = styled.img`
  width: 40px;
  border: 2px cyan solid;
  border-radius: 10px;
  margin-right: 10px;
`;

const Username = styled.p`
  font-size: 16px;
  color: #6e6b8c;
`;
const KD = styled.p`
  font-size: 16px;
  color: #6e6b8c;
`;


const UserListItem: React.FC<{ player: User }> = ({ player }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentEndpoint = location.pathname;


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
      {/* <KD>{player.gamesWon / player.gamesPlayed}</KD><br /> */}
      {/* {currentEndpoint === 'lobby' && (
        <> */}
      <AccessReady player={player} errors={errors} />
      <CheckAccess />
      {/* </>
      )} */}
    </UserContainer>
  );
};

export default UserListItem;
