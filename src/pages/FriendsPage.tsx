import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import UsersList from '../components/UsersList';
import { IoSearchCircle, IoCloseCircle } from 'react-icons/io5';
import Loading from '../components/Loading';

const Container = styled.div`
  background-color: #333;
  padding: 10px;
  margin: 10px;
`;

const SearchInput = styled.input`
  background-color: #222;
  color: #fff;
  padding: 10px;
  border: none;
  width: 100%;
`;

const SearchIcon = styled(IoSearchCircle)`
  color: #fff;
`;

const CloseIcon = styled(IoCloseCircle)`
  color: #fff;
`;

interface FriendsPageProps {
  onlineFriends: Array<{ image: string; username: string }>;
  offlineFriends: Array<{ image: string; username: string }>;
  // Adjust the type of searchUsers based on your implementation
  searchUsers: Array<{ image: string; username: string }>;
}

const FriendsPage: React.FC<FriendsPageProps> = ({ onlineFriends, offlineFriends, searchUsers }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <Container>
      <SearchInput placeholder="Search" value={searchText} onChange={handleSearchChange} />
      {searchText === '' ? <CloseIcon /> : <SearchIcon />}

      {searchText === '' ? (
        <>
          <UsersList users={onlineFriends} header={`Online • ${onlineFriends.length}`} />
          <UsersList users={offlineFriends} header={`Offline • ${offlineFriends.length}`} />
        </>
      ) : searchUsers.length === 0 ? (
        <Loading />
      ) : (
        <UsersList users={searchUsers} />
      )}
    </Container>
  );
};

export default FriendsPage;
