import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateFaceDescriptions from '../components/CreateFaceDescriptions';
import TrophyGenerator from '../components/TrophyGenerator';
import SavedTrophy from '../components/SavedTrophy';
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
          <XCircle className='react-icon' onClick={()=>{setPhotoStatus('profile')}}/>
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
          <div className='profile-grid'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {user.picter ? (
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
                <h6 className='profile__title'>{user?.name}</h6>
                <span className='profile__description'>
                  {user?.email}
                  {/* <ButtonToUpdateEmail /> */}
                </span>
              </div>
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
                <h3>
                  Citizen has not been processed by the CorpoReality Police.
                </h3>
                <h3>Please send in Biodata to participate in SOCIETY™.</h3>
                <button
                  style={{ background: '#6e6b8c', color: 'white' }}
                  onClick={() => setPhotoStatus('camera')}
                >
                  Send BioData
                </button>
              </div>
            )}
            <div className='profile__details'>
              <h6>Games Played: {userData?.gamesPlayed}</h6>
              <h6>Games Won: {userData?.gamesWon}</h6>
              <h6>Kills Confirmed: {userData?.killsConfirmed}</h6>
            </div>
            <div style={{ width: '300px', height: '300px' }}>
              <TrophyGenerator />
            </div>
            <div style={{ width: '300px', height: '300px' }}>
              <SavedTrophy />
            </div>
          </div>
        </div>
        
      </Main>
    </Container>
  );
};

export default ProfilePage;
