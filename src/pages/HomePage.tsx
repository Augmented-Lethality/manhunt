import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ButtonToFindGame, ButtonToHostGame } from '../components/Buttons';
import DropDownMenu from '../components/DropDownMenu';
import SocketContext from '../contexts/Socket/SocketContext';
import { Container } from '../styles/Container';
import { HomeHeader } from '../styles/Header';
import { Main } from '../styles/Main';
import { BsPersonSquare } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

type UserData = {
  username: string;
  email: string;
  authId: string;
  // Add other user data properties as needed
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();
  const { users } = useContext(SocketContext).SocketState;
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const postUserData = async () => {
      try {
        // Check if the user exists by sending a POST request instead of a GET request
        const response = await axios.post<UserData>('/Users', {
          username: user?.name,
          email: user?.email,
          authId: user?.sub,
          // Include other user data properties you want to save
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isAuthenticated && user) {
      postUserData();
      const insertName = `${user.given_name || ''} ${user.family_name?.charAt(
        0
      )}`;
    }
  }, [user, isAuthenticated, users]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Container>
      <HomeHeader users={users}/>
      <Main>
        <ButtonToHostGame />
        <ButtonToFindGame />
      </Main>
    </Container>
  );
};

export default HomePage;
