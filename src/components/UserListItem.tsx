import React from 'react';
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

interface UserProps {
  user: {
    image: string;
    username: string;
  };
}

const UserListItem: React.FC<UserProps> = ({ user }) => {
  return (
    <UserContainer>
      <UserImage src={user.image} alt={user.username} />
      <Username>{user.username}</Username>
    </UserContainer>
  );
};

export default UserListItem;
