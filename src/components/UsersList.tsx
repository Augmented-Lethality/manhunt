import React from 'react';
import styled from 'styled-components';
import UserListItem from './UserListItem';
import { useNavigate } from 'react-router-dom';

const ListContainer = styled.div`
  margin-bottom: 30px;
`;

interface UsersListProps {
  users: Array<{ image: string; username: string }>;
  header?: string | null;
}

const UsersList: React.FC<UsersListProps> = ({ users, header }) => {
  const navigate = useNavigate();

  return (
    <ListContainer>
      {header && <h1>{header}</h1>}
      {users.map((user, index) => (
        <React.Fragment key={index}>
          <UserListItem user={user} onClick={()=>{navigate(`/profile/${user.username}`)}}/>
          <hr />
        </React.Fragment>
      ))}
    </ListContainer>
  );
};

export default UsersList;
