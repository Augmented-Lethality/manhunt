import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogoutButton } from '../Auth0/LogoutButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ButtonToProfile, ButtonToFindGame, ButtonToHostGame } from '../Buttons';

type UserData = {
  username: string;
  email: string;
  authId: string;
  // Add other user data properties as needed
}

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
        <h1>{`Welcome Home, ${user.name}`}!</h1>
        <ButtonToProfile />
        <ButtonToFindGame />
        <ButtonToHostGame />
        <LogoutButton />
      </div>
    )
  );
};

export default HomePage;
