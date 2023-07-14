import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import UsersList from '../components/UsersList';
import { Main } from '../styles/Main';
import { Header } from '../styles/Header';
import { Search, XCircle, Bell } from 'react-feather';

import SocketContext from '../contexts/Socket/SocketContext';

const Image = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  padding: 1rem;
  padding-bottom: 0;
  height: 145.5vw;
  width: 100%;
  box-sizing: border-box;
  background-image: url(/textures/computer.png);
  background-size: contain;
  background-repeat: no-repeat;
`;

const SearchBar = styled.div`
  position: absolute;
  bottom: 37vw;
  left: 35vw;
  height: 19vw;
  width: 53vw;
  display: flex;
  overflow: inherit;
  align-items: center;
  & > * {
    display: flex;
    align-items: end;
    margin: 1.5rem;
    color: cyan !important;
  }
`;

const FriendsContainer = styled.div`
  position: absolute;
  bottom: 72vw;
  left: 14vw;
  height: 53vw;
  width: 73vw;
  overflow: auto;
  // border: 2px solid green;
`;

const FriendsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [onlineFriends, setOnlineFriends] = useState<any[]>([]);
  const [offlineFriends, setOfflineFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [viewingPending, setViewingPending] = useState(false);
  const { user, isAuthenticated } = useAuth0();

  const { player } = useContext(SocketContext).SocketState;

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
    <>
      <Header page='Friends' />
      <Main style={{ height: '100vh' }}>
        <Image />
        <SearchBar>
          {searchText === ''
            ? <Search className='react-icon' style={{ margin: '5px' }} />
            : <XCircle className='react-icon' style={{ margin: '5px' }}
              onClick={() => { setSearchText('') }}
            />
          }
          <input
            type='text'
            placeholder='Search'
            value={searchText}
            style={{ marginLeft: '0px' }}
            onChange={handleInputChange}
          />
        </SearchBar>
        <FriendsContainer>
          <Bell
            className='digital-h1'
            style={{ position: 'absolute', right: 0 }}
            onClick={() => { setViewingPending(viewingPending => !viewingPending) }} />
          {searchText === '' ? (
            <>
              {viewingPending &&
                <UsersList users={pendingRequests} header={`Pending • ${pendingRequests.length}`} />
              }
              <UsersList users={onlineFriends} header={`Online • ${onlineFriends.length}`} />
              <UsersList users={offlineFriends} header={`Offline • ${offlineFriends.length}`} />
            </>
          ) : searchResults.length === 0 ? (
            <h2 className='digital-h1' style={{ textAlign: 'left' }}>Target not found.</h2>
          ) : (
            <UsersList header={`Results • ${onlineFriends.length}`} users={searchResults} />
          )}
        </FriendsContainer>
      </Main>
    </>
  )
};

export default FriendsPage;
