import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import UsersList from '../components/UsersList';
import {Container} from '../styles/Container';
import {Main} from '../styles/Main';
import {Header} from '../styles/Header';
import Search from 'react-feather/dist/icons/search';
import XCircle from 'react-feather/dist/icons/x-circle';

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


const SearchIcon = styled(Search)`
  color: #fff;
`;

const CloseIcon = styled(XCircle)`
  color: #fff;
`;

const FriendsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [offlineFriends, setOfflineFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if(user && isAuthenticated) {
      getFriends();
    }
  }, [user, isAuthenticated]); 

  useEffect(() => {
    handleSearch();
  }, [searchText]); 

  const getFriends = async () => {
    try {
      const res = await axios.get('/friends', {
        params: {
          userId: user?.sub,
          status: 'accepted'
        }
     });
      if (res.status === 200) {
        let onlineFriends;
        let offlineFriends;
        res.data.forEach(friend => {
          if(friend.gameId){
            onlineFriends.push(friend);
          } else {
            offlineFriends.push(friend);
          }
        });
        setOnlineFriends(onlineFriends);
        setOfflineFriends(offlineFriends);
      }
    } catch(err) {
      console.log(err);
    }
  }

  const handleSearch = async () => {
    if(!searchText.length){
      return;
    }
    try {
      const res = await axios.get(`/users/search/${searchText}`)
      if(res.status === 200){
        setSearchResults(res.data)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  if(!user || !isAuthenticated){
    return null;
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
            onChange={handleInputChange}
            />
        {searchText === '' ?
        <SearchIcon className='react-icon'/>
        : <CloseIcon onClick={() => {setSearchText('')}} className='react-icon'/>}
       </SearchBar>
        <FriendsContainer>
          {searchText === '' ? (
            <>
              <UsersList users={onlineFriends} header={`Online • ${onlineFriends.length}`} />
              <UsersList users={offlineFriends} header={`Offline • ${offlineFriends.length}`} />
            </>
          ) : searchResults.length === 0 ? (
            <p>no users found</p>
          ) : (
            <UsersList users={searchResults} />
          )}
        </FriendsContainer>
      </Main>
    </Container>
  )
};

export default FriendsPage;
