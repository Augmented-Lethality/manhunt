import React from 'react';
import styled from 'styled-components';
import UserListItem from './UserListItem';
import { User } from '../contexts/Socket/SocketContext';

const ListContainer = styled.div`
  margin-bottom: 30px;
`;

interface UsersListProps {
  users: User[];
  header?: string | null;
}

const UsersList: React.FC<UsersListProps> = ({ users, header }) => {

  return (
    <ListContainer>
      {header && <h1>{header}</h1>}
      {users.map((user, index) => (
        <React.Fragment key={index}>
          <UserListItem player={user} />
          <hr />
        </React.Fragment>
      ))}
    </ListContainer>
  );
};

export default UsersList;
