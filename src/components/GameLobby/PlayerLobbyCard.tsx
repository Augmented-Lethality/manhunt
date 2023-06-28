import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '../../styles/Container';
import { Main } from '../../styles/Main';


// MAY BE USED LATER

export type PlayerInfo = {
  username: string;
  gamesPlayed: number;
  gamesWon: number;
  killsConfirmed: number;
};




const PlayerLobbyCard: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<PlayerInfo | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<PlayerInfo>(`/users/${user?.sub}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setUserData(response.data[0]);
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

  return (
    <Container>
      <Main>
        <div className='content__body'>
          <div className='profile-grid'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {user.picture ? (
                <img
                  src={user?.picture}
                  className='profile__avatar'
                  style={{ height: '14vh', width: '14vh', borderRadius: '50%' }}
                />
              ) : (
                <h1 className='alt-user-pic-large'>
                  {user.name?.slice(0, 1)}
                </h1>
              )}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  margin: '6vh',
                  alignItems: 'start',
                }}
              >
                <h6 className='profile__title'>{userData?.username}</h6>
              </div>
            </div>
            <div className='profile__details'>
              <h6>Games Played: {userData?.gamesPlayed}</h6>
              <h6>Games Won: {userData?.gamesWon}</h6>
              <h6>Kills Confirmed: {userData?.killsConfirmed}</h6>
            </div>
          </div>
        </div>
      </Main>
    </Container>
  );
};

export default PlayerLobbyCard;
