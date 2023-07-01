import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import CreateFaceDescriptions from '../components/CreateFaceDescriptions';
import { Container } from '../styles/Container';
import { Header, StyledHeader } from '../styles/Header';
import { Main } from '../styles/Main';
import XCircle from 'react-feather/dist/icons/x-circle';

export type UserData = {
  userId: number;
  username: string;
  email: string;
  authId: string;
  gamesPlayed: number;
  gamesWon: number;
  killsConfirmed: number;
  facialDescriptions: Array<number> | null;
  // Add other user data properties as needed
};

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [photoStatus, setPhotoStatus] = useState('profile, camera, photo');

  const winLossRatio =
    userData?.gamesPlayed && userData?.gamesWon
      ? userData.gamesWon / userData.gamesPlayed
      : 0;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserData>(`/Users/${user?.sub}`, {
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

  if (photoStatus === 'camera') {
    return (
      <Container>
        <StyledHeader>
          <h1>BioData</h1>
          <XCircle
            className='react-icon'
            onClick={() => {
              setPhotoStatus('profile');
            }}
          />
        </StyledHeader>
        <CreateFaceDescriptions
          setPhotoStatus={setPhotoStatus}
          username={user?.name}
          userID={user?.sub}
          setUser={setUserData}
        />
      </Container>
    );
  }
  return (
    <Container>
      <Header page='Profile' />
      <Main>
        <div className='content__body'>
          <div className='profile-container'>
            <div style={{ display: 'flex', alignItems: 'center'}}>
              {user.picture ? (
                <img
                  src={user?.picture}
                  className='profile__avatar'
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '50%' }}
                  // style={{ height: '14vh', width: '14vh', borderRadius: '50%' }}
                />
              ) : (
                <h1 className='alt-user-pic-large'>{user.name?.slice(0, 1)}</h1>
              )}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  margin: '6vh',
                  alignItems: 'start',
                }}
              >
                <h2 className='profile__title'>{user?.name}</h2>
                <span className='profile__description'>
                  {user?.email}
                  {/* <ButtonToUpdateEmail /> */}
                </span>
              </div>
            </div>
           
            <div className='profile__details'>
              <h4>Games Played: {userData?.gamesPlayed}</h4>
              <h4>Games Won: {userData?.gamesWon}</h4>
              <h4>Kills Confirmed: {userData?.killsConfirmed}</h4>
              <h4>Win / Loss Ratio: {winLossRatio}</h4>
            </div>
            {userData?.facialDescriptions ? (
              <div className='profile_verification'>
                <p style={{ textAlign: 'start', margin: '3vh' }}>
                  Citizen has been verified. The CorpoVerse thanks you for your
                  cooperation.
                </p>
                <button onClick={() => setPhotoStatus('camera')}>
                  Feeling Patriotic? Reverify
                </button>
              </div>
            ) : (
              <div className='profile_verification'>
                <h4>
                  Citizen has not been processed by the CorpoReality Police.
                </h4>
                <h4>Please send in Biodata to participate in SOCIETY™.</h4>
                <button
                  style={{ background: '#6e6b8c', color: 'white' }}
                  onClick={() => setPhotoStatus('camera')}
                >
                  Send BioData
                </button>
              </div>
            )}
          </div>
          
        </div>
      </Main>
    </Container>
  );
};

export default ProfilePage;
