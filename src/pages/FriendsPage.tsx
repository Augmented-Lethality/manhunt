import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import UsersList from '../components/UsersList';
import { IoSearchCircle, IoCloseCircle } from 'react-icons/io5';
import Loading from '../components/Loading';
import {Container} from '../styles/Container';
import {Main} from '../styles/Main';
import {Header} from '../styles/Header';

const FriendsContainer = styled.div`
  background-color: #3C3E49;
  padding: 20px;
  margin: 20px;
  margin-bottom: 0;
  flex-grow: 1;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  margin-inline: auto;
  background-color: #2B2B32;
  color: #fff;
  padding: 10px;
  border: none;
  width: 70%;
  height: 30px;
`;


const SearchIcon = styled(IoSearchCircle)`
  color: #fff;
`;

const CloseIcon = styled(IoCloseCircle)`
  color: #fff;
`;

const FriendsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [offlineFriends, setOfflineFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  if(!onlineFriends || !offlineFriends){
    return (
      <Container>
        <Header page='Friends'/>
        <Main style={{marginBottom: 0}}>
          <FriendsContainer>
            <Loading/>
          </FriendsContainer>
        </Main>
      </Container>
    )
  }

  return (
    <Container>
      <Header page='Friends'/>
      <Main style={{marginBottom: 0, display:'flex'}}>
        <SearchBar>
          <input
            type='text'
            placeholder="Search"
            value={searchText}
            onChange={handleSearchChange}
            />
        {searchText === '' ? <SearchIcon className='react-icon'/> : <CloseIcon className='react-icon'/>}
       </SearchBar>
        <FriendsContainer>
          {searchText === '' ? (
            <>
              <UsersList users={onlineFriends} header={`Online • ${onlineFriends.length}`} />
              <UsersList users={offlineFriends} header={`Offline • ${offlineFriends.length}`} />
            </>
          ) : searchResults.length === 0 ? (
            <Loading />
          ) : (
            <UsersList users={searchResults} />
          )}
        </FriendsContainer>
      </Main>
    </Container>
  )
};

export default FriendsPage;
