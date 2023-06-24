import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ButtonToFindGame, ButtonToHostGame } from '../components/Buttons';
import DropDownMenu from '../components/DropDownMenu';
import SocketContext from '../contexts/Socket/SocketContext';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header';
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

    // console.log("users in socket state:", users, users.length)
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
    }
  }, [user, isAuthenticated, users]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Container>
      <Header>
        <h1 className='logo'>Man Hunt</h1>
        <p>Users Online: {users.length}</p>
        <img
          src={user.picture}
          alt='Profile'
          className='profile__avatar'
          onClick={()=>{navigate('/profile')}}
          style={{ height: '10vw', width: '10vw', borderRadius:'50%' }}/>
          <DropDownMenu>
            <div onClick={()=>{navigate('/profile')}}><BsPersonSquare/>profile</div>
          </DropDownMenu>
      </Header>
      <Main>
        <ButtonToHostGame />
        <ButtonToFindGame />
      </Main>
    </Container>
  );
};

export default HomePage;
