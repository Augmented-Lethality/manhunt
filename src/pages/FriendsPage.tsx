import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../contexts/Socket/SocketContext';
import { ButtonToHome } from '../components/Buttons';
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from '../styles/Container';
import { Header } from '../styles/Header'
import { Main } from '../styles/Main'
import { PlayerListItem } from '../components/GameLobby/PlayerListItem';
import { HiUserAdd } from 'react-icons/hi';
import axios from 'axios';
import { UserData } from './ProfilePage';

const FriendsPage: React.FunctionComponent = (props) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { user, isAuthenticated } = useAuth0();
  const { games, users } = useContext(SocketContext).SocketState;
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserData>(`/Users/${user?.sub}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    if (isAuthenticated && user) {
      fetchUserData();
    }
  }, []);


  
  return (
    <Container>
      <Header>
        <h2>Friends</h2>
        <div onClick={()=>{}}><HiUserAdd/>Friends</div>
        <ButtonToHome />
      </Header>
      <Main>
        {/* {user} */}
      </Main>
    </Container>
  );
};

export default FriendsPage;
