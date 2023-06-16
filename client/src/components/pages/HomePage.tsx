import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogoutButton } from '../Auth0/LogoutButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ButtonToProfile, ButtonToFindGame, ButtonToLobby } from '../Buttons';

// import ChaseCam from '../components/ChaseCam'

type UserData = {
  username: string;
  email: string;
  authId: string;
  // Add other user data properties as needed
}

// import ChaseCam from '../components/ChaseCam'

import ButtonToHostLobby from '../buttons/ButtontoHostLobby';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

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
    }
  }, []);

  if (!user) {
    return null;
  }
  console.log(user);
  return (
    isAuthenticated && (
      <div>
        <h1>{`Welcome Home, ${user.given_name}`}!</h1>
        <ButtonToProfile />
        <ButtonToFindGame />
        <ButtonToLobby />
        <LogoutButton />
        <ButtonToHostLobby />
        {/* <ChaseCam /> */}
      </div>
    )
  );
};

export default HomePage;
