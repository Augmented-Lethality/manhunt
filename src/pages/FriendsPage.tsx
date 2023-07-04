import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import UsersList from '../components/UsersList';
import { Container } from '../styles/Container';
import { Main } from '../styles/Main';
import { Header } from '../styles/Header';
import { Search, XCircle, Bell } from 'react-feather';


const FriendsContainer = styled.div`
  background-color: #26262d;
  padding: 20px;
  margin-inline: 20px;
  flex-grow: 1;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  margin: 20px;
  margin-inline: auto;
  background-color: #2b2b36;
  padding: 10px;
  width: 70%;
  height: 30px;
`;


const SearchIcon = styled(Search)`
  color: #fff;
`;

const CloseIcon = styled(XCircle)`
  color: #fff;
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
      console.log(res.data);
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
        <SearchBar>
          <input
            type='text'
            placeholder="Find a Hunter"
            value={searchText}
            onChange={handleInputChange}
          />
          {searchText === '' ?
            <SearchIcon className='react-icon' />
            : <CloseIcon onClick={() => { setSearchText('') }} className='react-icon' />}
        </SearchBar>
        <FriendsContainer>
          {searchText === '' ? (
            <>
              <Bell onClick={() => { setViewingPending(viewingPending => !viewingPending) }} />
              {viewingPending &&
                <UsersList users={pendingRequests} header={`Requests • ${pendingRequests.length}`} />
              }
              <UsersList users={onlineFriends} header={`Online • ${onlineFriends.length}`} />
              <UsersList users={offlineFriends} header={`Offline • ${offlineFriends.length}`} />
            </>
          ) : searchResults.length === 0 ? (
            <h3 style={{ textAlign: 'center' }}>You've got the wrong guy!</h3>
          ) : (
            <UsersList users={searchResults} />
          )}
        </FriendsContainer>
      </Main>
    </Container>
  )
};

export default FriendsPage;
