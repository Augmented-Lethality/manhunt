import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import UsersList from '../components/UsersList';
import { Container } from '../styles/Container';
import { Main } from '../styles/Main';
import { Header } from '../styles/Header';
import { Search, XCircle, Bell } from 'react-feather';

const Image = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  padding: 1rem;
  padding-bottom: 0;
  height: 134.5vw;
  width: 100%;
  box-sizing: border-box;
  background-image: url(/textures/computer.png);
  background-size: contain;
  background-repeat: no-repeat;
`;


const SearchBar = styled.div`
  position: absolute;
  bottom: 28vw;
  left: 34vw;
  height: 17vw;
  width: 56vw;
  display: flex;
  align-items: center;
  & > * {
    display: flex;
    align-items: end;
    margin: 1.5rem;
    color: cyan;
  }
  & > * > * {
    margin-right: 10px;
    color: cyan;
  }
`;

const FriendsContainer = styled.div`
  position: absolute;
  bottom: 64vw;
  left: 14vw;
  height: 53vw;
  width: 73vw;
  // border: 2px solid green;
`;



// const FriendsContainer = styled.div`
//   background-color: #26262d;
//   padding: 20px;
//   margin-inline: 20px;
//   flex-grow: 1;
// `;

// const SearchBar = styled.div`
//   display: flex;
//   align-items: center;
//   margin: 20px;
//   margin-inline: auto;
//   background-color: #2b2b36;
//   padding: 10px;
//   width: 70%;
//   height: 30px;
// `;


const FriendsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [onlineFriends, setOnlineFriends] = useState<any[]>([]);
  const [offlineFriends, setOfflineFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [viewingPending, setViewingPending] = useState(false);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (user && isAuthenticated) {
      getFriends();
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    handleSearch();
  }, [searchText]);

  const getFriends = async () => {
    try {
      const res = await axios.get(`/friends/${user?.sub}`);
      // console.log(res.data);
      if (res.status === 200) {
        let online: any[] = [];
        let pending: any[] = [];
        let blocked: any[] = [];
        res.data.forEach(resUser => {
          if (resUser.status === 'blocked') {
            blocked.push(resUser);
          } else if (resUser.status === 'pending') {
            pending.push(resUser)
          }
          else {
            online.push(resUser);
          }
        });
        setOnlineFriends(online);
        setPendingRequests(pending);
        setBlockedUsers(blocked);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleSearch = async () => {
    if (!searchText.length) {
      return;
    }
    try {
      const res = await axios.get(`/users/search/${searchText}`);
      if (res.status === 200) {
        const filteredFriends = res.data.filter(player => player.authId !== user?.sub);
        setSearchResults(filteredFriends);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  if (!user || !isAuthenticated) {
    return null;
  }

  return (
    <Container>
      <Header page='Friends' />
      <Main>
        <Image/>
        <SearchBar>
          {searchText === '' 
            ? <Search className='digital-h1' />
            : <XCircle className='digital-h1' onClick={() => { setSearchText('') }} />
          }
          <input
            type='text'
            placeholder="Find a Hunter"
            value={searchText}
            onChange={handleInputChange}
          />
        </SearchBar>
        <FriendsContainer>
          <Bell className='digital-h1' onClick={() => { setViewingPending(viewingPending => !viewingPending) }} />
          {searchText === '' ? (
            <>
              {viewingPending &&
                <UsersList users={pendingRequests} header={`Pending • ${pendingRequests.length}`} />
              }
              <UsersList users={onlineFriends} header={`Online • ${onlineFriends.length}`} />
              <UsersList users={offlineFriends} header={`Offline • ${offlineFriends.length}`} />
            </>
          ) : searchResults.length === 0 ? (
            <h2 className='digital-h1' style={{ textAlign: 'center' }}>You've got the wrong guy!</h3>
          ) : (
            <UsersList header={`Results • ${onlineFriends.length}`} users={searchResults} />
          )}
        </FriendsContainer>
      </Main>
    </Container>
  )
};

export default FriendsPage;
