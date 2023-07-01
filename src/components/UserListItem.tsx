import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

interface UserListItemProps {
  user: {
    image: string;
    username: string;
  };
}

const UserListItem: React.FC<UserListItemProps> = ({ user }) => {
  const navigate = useNavigate();
  
  return (
    <UserContainer onClick={() => navigate(`/profile/${user.username}`)}>
      {user.image ? (
        <UserImage src={user.image} alt={user.username} />
      ) : (
        <h1 className='alt-user-pic'>
          <p>{user.username?.slice(0, 1)}</p>
        </h1>
      )}
      <Username>{user.username}</Username>
    </UserContainer>
  );
};

export default UserListItem;
