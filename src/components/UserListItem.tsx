import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';


const UserContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

const UserImage = styled.img`
  width: 30px;
  border-radius: 3px;
  margin-right: 10px;
`;

const Username = styled.p`
  font-size: 16px;
  color: cyan;
`;
const KD = styled.p`
  font-size: 16px;
  color: #6e6b8c;
`;

const UserListItem: React.FC<{ player: User }> = ({ player }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentEndpoint = location.pathname;


  const handleClick = () => {
    if(currentEndpoint !== '/lobby'){
      navigate(`/profile/${player.username}`);
    }
  }

  return (
    <UserContainer onClick={handleClick}>
      {player.image ? (
        <UserImage src={player.image} alt={player.username} />
      ) : (
        <h1 className='alt-user-pic'>
          <p>{player.username?.slice(0, 1)}</p>
        </h1>
      )}
      <Username>{player.username}</Username><br />
    </UserContainer>
  );
};

export default UserListItem;
