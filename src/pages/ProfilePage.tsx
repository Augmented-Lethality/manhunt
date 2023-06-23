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
  const [trophyData, setTrophyData] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserData>(`/Users/${user?.sub}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchTrophyData = async () => {
      try {
        const response = await axios.get(`/trophies/${user?.id}`, {});
        setTrophyData(response.data);
      } catch (error) {
        console.error('Error fetching trophy data:', error);
      }
    };

    if (isAuthenticated && user) {
      fetchUserData();
      fetchTrophyData();
    }

    console.log('userData:', userData);
    console.log('trophyData:', trophyData);
  }, [user, isAuthenticated]);

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
      {/* <div style={{ width: '300px', height: '300px' }}>
        <TrophyGenerator />
      </div> */}
      {/* <div style={{ width: '300px', height: '300px' }}>
        <SavedTrophy />
      </div> */}

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
                  margin: '2vh',
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
              <br />
              <br />
              <h2>Games Played: {userData?.gamesPlayed}</h2>
              <h2>Games Won: {userData?.gamesWon}</h2>
              <h2>Kills Confirmed: {userData?.killsConfirmed}</h2>
            </div>
          </div>
        </div>
      </Main>
    </Container>
  );
};

export default ProfilePage;
