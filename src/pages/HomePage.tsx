import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import {
  ButtonToProfile,
  ButtonToFindGame,
  ButtonToHostGame,
  LogoutButton,
} from '../components/Buttons';
import DropDownMenu from '../components/DropDownMenu';
import SocketContext from '../contexts/Socket/SocketContext';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';

type UserData = {
  username: string;
  email: string;
  authId: string;
  // Add other user data properties as needed
};

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const { AddName } = useContext(SocketContext);
  const { uid, users } = useContext(SocketContext).SocketState;
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if the user exists by sending a POST request instead of a GET request
        const response = await axios.post<UserData>('/Users', {
          username: user?.name,
          email: user?.email,
          authId: user?.sub,
          // Include other user data properties you want to save
        });
        setUserData(response.data);
        // console.log(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isAuthenticated && user) {
      fetchUserData();
      const insertName = `${user.given_name || ''} ${user.family_name?.charAt(
        0
      )}`;
      AddName(insertName || '', uid);
    }
  }, [user, isAuthenticated, AddName, uid]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Container>
      <Header>
        <h1 className='logo'>Man Hunt</h1>
        <img
          src={user.picture}
          alt='Profile'
          className='profile__avatar'
          style={{ height: '10vw', width: '10vw', borderRadius:'50%' }}/>
          <DropDownMenu>
            <div>profile</div>
            <div>friends</div>
            <div>settings</div>
            <div>logout</div>
          </DropDownMenu>
      </Header>
      <Main>
        <ButtonToProfile />
        <ButtonToHostGame />
        <ButtonToFindGame />
        <LogoutButton />
      </Main>
    </Container>
  );
};

export default HomePage;
