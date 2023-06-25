import React from 'react';
import styled from 'styled-components';
import UserListItem from './UserListItem';

const ListContainer = styled.div`
  margin-bottom: 30px;
`;

// const Header = styled.h1`
//   font-size: 24px;
//   color: #000;
// `;

interface UsersListProps {
  users: Array<{ image: string; username: string }>;
  header?: string | null;
}

const UsersList: React.FC<UsersListProps> = ({ users, header }) => {
  return (
    <ListContainer>
      {header && <h1>{header}</h1>}
      {users.map((user, index) => (
        <React.Fragment key={index}>
          <UserListItem user={user} />
          <hr />
        </React.Fragment>
      ))}
    </ListContainer>
  );
};

export default UsersList;
