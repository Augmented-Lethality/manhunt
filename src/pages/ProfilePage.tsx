import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState, useContext, lazy, Suspense } from 'react';
import axios from 'axios';
import CreateFaceDescriptions from '../components/CreateFaceDescriptions';
import { Header, StyledHeader } from '../styles/Header';
import { Main } from '../styles/Main';
import XCircle from 'react-feather/dist/icons/x-circle';
import styled from 'styled-components';
import SingleTrophy from '../components/Trophies/SingleTrophy';
import InfoPopup from '../components/Popups/InfoPopup';
import IdCard from '../components/ProfilePieces/IdCard';
import IdPaper from '../components/ProfilePieces/IdPaper';
import SocketContext from '../contexts/Socket/SocketContext'

export type UserData = {
  id: number;
  username: string;
  email: string;
  authId: string;
  gamesPlayed: number;
  gamesWon: number;
  killsConfirmed: number;
  facialDescriptions: Array<number> | null;
  // Add other user data properties as needed
};

//ID card background that user data sits on
const TrophyContainer = styled.div`
  box-sizing: border-box;
  background-color: #25465157;
  box-shadow: inset 0px 10px 10px 5px #000000b3, 0 0 10px 1px #ffffff47;
  border-radius: 50%;
  margin: 20px;
  margin-inline: auto;
  height: 200px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Eyeball moved to IdPaper.tsx

//ID card background that user data sits on
const VerificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  margin-inline: auto;
  margin-bottom: 0;
  border-radius: 45px 45px 0 0 !important;
  padding: 25px;
  width: 90vw;
`;

const VerTitleContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin: 10px;
`;

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [photoStatus, setPhotoStatus] = useState('profile, camera, photo');
  const [trophiesExist, setTrophiesExist] = useState(false);

  const { player } = useContext(SocketContext).SocketState;


  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchUserTrophyData();
  }, [userData]);


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

  const fetchUserTrophyData = async () => {
    try {
      if (userData) {
        const response = await axios.get<
          {
            id: number;
            name: string;
            description: string;
            createdAt: string;
            generationConditions: string;
          }[]
        >(`/trophies/${userData.id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        response.data.length === 0 ?
          setTrophiesExist(false) :
          setTrophiesExist(true);
      }
    } catch (error) {
      console.error('Error fetching user trophy data:', error);
    }
  };

  if (!user) {
    return null;
  }

  if (photoStatus === 'camera') {
    return (
      <>
        <StyledHeader style={{ display: 'flex', alignItems: 'start', justifyContent: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
            <XCircle
              className='react-icon'
              onClick={() => {
                setPhotoStatus('profile');
              }}
            />
            <h1 style={{ fontSize: '2.3rem' }}>Bio Data</h1>
          </div>
        </StyledHeader>
        <Main>
          <CreateFaceDescriptions
            setPhotoStatus={setPhotoStatus}
            username={user?.name}
            userID={user?.sub}
            setUser={setUserData}
          />
        </Main>
      </>
    );
  }


  const verifiedMessage = 'At Corpoverse, we prioritize your privacy and security.\n\n' +
    'Your Bio Data is used for internal state-related activities and is stored as vectors, not the picture itself, ensuring your utmost safety.\n\n' +
    'We operate independently, disregarding any external governing body; your data is safe with us!'

  const notVerifiedMessage = 'Citizen has not been processed by the CorpoReality Police.\n\n' +
    'Use the button below to verify your Bio Data and Corpoverse may gift you an official ID; depends on if you\'re deemed a proper bounty hunter by your mug.';

  return (
    <>
      <Header page='Profile' />
      <Main>
        {player.facialDescriptions ? <InfoPopup message={verifiedMessage} /> : <InfoPopup message={notVerifiedMessage} />}
        {player.facialDescriptions && (
          trophiesExist ? (
            <TrophyContainer>
              <SingleTrophy
                id={0}
                name={''}
                description={''}
                createdAt={''}
                dimension={0}
                color={''}
                shape={''}
                tubularSegments={0}
                tubeWidth={0}
                dimensionTwo={0}
                dimensionThree={0}
              />
            </TrophyContainer>
          ) : (
            <TrophyContainer>
              <iframe src="https://giphy.com/embed/DcTN1NEaLjw4E0xvAE" width="90" height="160" frameBorder="0" allowFullScreen></iframe>
            </TrophyContainer>
          )
        )}
        {player.facialDescriptions ? <IdCard /> : <IdPaper />}
        <VerificationContainer className='glassmorphism'>
          <VerTitleContainer>
            {player.facialDescriptions ? (
              <h2 style={{ fontSize: '1.6rem', }}>Citizen Verified!</h2>
            ) : (
              <h3>
                Please send in Bio Data to participate in SOCIETY™.
              </h3>
            )}
            {player.facialDescriptions ? (
              <>
                <h3>Feeling Patriotic?</h3>
                <button className="glassmorphism" onClick={() => setPhotoStatus('camera')}>
                  → Reverify ←
                </button>
              </>
            ) : (
              <>
                <h3>↓↓↓VERIFY↓↓↓ </h3>
                <button className="glassmorphism" onClick={() => setPhotoStatus('camera')}>
                  Send BioData
                </button>
              </>
            )}
          </VerTitleContainer>
        </VerificationContainer>
      </Main>
    </>
  );
};

export default ProfilePage;
