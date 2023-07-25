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
  background-image: url("https://d3d9qwhf4u1hj.cloudfront.net/images/computer.png");
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



const HuntersPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [viewingPending, setViewingPending] = useState(false);
  const { user, isAuthenticated } = useAuth0();

  const { player } = useContext(SocketContext).SocketState;

  console.log(user, 'user')
  useEffect(() => {
    if (user && isAuthenticated) {
      getFriends();
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    console.log(friends, 'friends')
  }, [friends]);

  useEffect(() => {
    handleSearch();
  }, [searchText]);

  //get the users friends when the page loads
  const getFriends = async () => {
    try {
      const res = await axios.get(`/friends/${user?.sub}`);
      const {friends, receivedRequests} = res.data;
      console.log(res.data, 'status')
      console.log(friends, receivedRequests, 'friends, pending');
      if (res.status === 200 && friends && receivedRequests) {
        setFriends(friends);
        setPendingRequests(receivedRequests);
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
        //remove yourself from the results
        const filteredFriends = res.data.filter(
          player => player.username !== user?.name
        );
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
      <Header page='Hunters' />
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
          {viewingPending 
            ? <XCircle 
                className='digital-h1'
                style={{ position: 'absolute', right: 0 }}
                onClick={() => { setViewingPending(viewingPending => !viewingPending) }}
              />
            : 
              <div
                className='digital-h1'
                style={{ position: 'absolute', right: 0, flexDirection: 'row', display: 'flex' }}
                onClick={() => { setViewingPending(viewingPending => !viewingPending) }}
              >
                <Bell/>
                {pendingRequests.length &&
                  <h4>{`${pendingRequests.length}`}</h4>
                }
              </div>
          }
          {searchText === '' ? (
            <>
              {viewingPending 
              ? <UsersList users={pendingRequests} header={`Pending • ${pendingRequests.length}`} />
              : <UsersList users={friends} header={`Friends • ${friends.length}`} />
              }
            </>
          ) : searchResults.length === 0 ? (
            <h2 className='digital-h1' style={{ textAlign: 'left' }}>Target not found</h2>
          ) : (
            <UsersList header={`Results • ${friends.length}`} users={searchResults} />
          )}
        </FriendsContainer>
      </Main>
    </>
  )
};

export default HuntersPage;
