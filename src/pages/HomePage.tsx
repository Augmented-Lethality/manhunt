import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ButtonToFindGame, ButtonToHostGame } from '../components/Buttons';
import SocketContext from '../contexts/Socket/SocketContext';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { useFontSize } from '../contexts/FontSize';

type UserData = {
  username: string;
  email: string;
  authId: string;
  largeFont: boolean;
  // Add other user data properties as needed
};

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const { users } = useContext(SocketContext).SocketState;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [fontSize, setFontSize] = useFontSize();


  useEffect(() => {
    const postUserData = async () => {
      try {
        // Check if the user exists by sending a POST request
        const response = await axios.post<UserData>('/Users', {
          username: user?.name,
          email: user?.email,
          authId: user?.sub,
          image: user?.picture || null,
          largeFont: false
          // Include other user data properties you want to save
        });
        setUserData(response.data);
        //setLargeFontSetting
        if (response.data.largeFont) {
          setFontSize(20);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isAuthenticated && user) {
      postUserData();
    }
  }, [user, isAuthenticated]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Container>
      <Header page={'Home'} users={users} />
      <Main>
        <ButtonToHostGame />
        <ButtonToFindGame />
      </Main>
    </Container>
  );
};

export default HomePage;
