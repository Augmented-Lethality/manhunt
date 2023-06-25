import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ButtonToHome } from '../components/Buttons';
import CreateFaceDescriptions from '../components/CreateFaceDescriptions';
import TrophyGenerator from '../components/TrophyGenerator';
import SavedTrophy from '../components/SavedTrophy';
import { Container } from '../styles/Container';
import { Header, Footer } from '../styles/Header';
import { Main } from '../styles/Main';
import { AiFillCloseCircle } from 'react-icons/ai';
import { IoSave, IoCamera } from 'react-icons/io5';

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
        console.log('User Data:', response.data); // Log the response data
        setUserData(response.data[0]);
        console.log('userDATA SET:', userData);
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
        <Header>
          <h1>BioData</h1>
          <AiFillCloseCircle
            className='react-icon'
            onClick={() => {
              setPhotoStatus('profile');
            }}
          />
        </Header>
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
      <Header>
        <h1>Profile</h1>
        <ButtonToHome></ButtonToHome>
      </Header>

      <Main>
        <div className='content__body'>
          <div className='profile-grid'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={user?.picture}
                alt='Profile'
                className='profile__avatar'
                style={{ height: '14vh', width: '14vh', borderRadius: '50%' }}
              />
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
    </Container>
  );
};

export default ProfilePage;
