import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import CreateFaceDescriptions from '../components/CreateFaceDescriptions';
import { Container } from '../styles/Container';
import { Header, StyledHeader } from '../styles/Header';
import { Main } from '../styles/Main';
import XCircle from 'react-feather/dist/icons/x-circle';
import styled from 'styled-components';
import SingleTrophy from '../components/SingleTrophy'

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

//ID card background that user data sits on
const TrophyContainer = styled.div`
  box-sizing: border-box;
  background-color: #25465157;
  border: 6px solid #ffffffad;
  box-shadow: inset 0px 10px 10px 5px #000000b3;
  border-radius: 50%;
  margin: 20px;
  margin-inline: auto;
  height: 200px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`

//ID card background that user data sits on
const TempIdContainer = styled.div`
  background: url(/textures/paper.png);
  background-size: cover;
  background-position: center;
  border-radius: 19px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  margin: 20px;
  margin-inline: auto;
  padding: 20px;
  height: 180px;
  width: 80%;
  max-width: 300px;
  box-shadow: 0px 10px 10px 2px #00000059;
`

//ID card background that user data sits on
const IdContainer = styled.div`
  border-radius: 19px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  margin: 20px;
  margin-inline: auto;
  padding: 20px;
  height: 180px;
  width: 80%;
  max-width: 300px;
  box-shadow: 0px 10px 10px 2px #00000059;
  & > * {
    opacity: 0.85;
  }
`
//Container For Name and Picture
const NameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  margin: 10px;
  height: 59px;
`

const BottomofIdContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  width: 100%;
`

//Container For Player Stas
const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`

function Eyeball() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60' width='135' height='60' style={{ transform: 'rotate(180deg' }}>
      <path transform='translate(-10, -20)' fill='#01010b' d='M50.006 20C19.509 20 4.978 50.028 5 50.028l.013-.026s13.984 29.997 44.993 29.997C78.997 80 95 50.002 95 50.002S80.997 20 50.006 20zm16.991 25.007a2 2 0 01-2 2h-11v-4h11a2 2 0 012 2zm-19 4h4v11a2 2 0 01-4 0v-11zm2-21a2 2 0 012 2v11h-4v-11a2 2 0 012-2zm-15 15h11v4h-11a2 2 0 010-4zm15.009 31c-11 0-20.891-4.573-29.399-13.104-4.086-4.096-7.046-8.26-8.61-10.867 2.787-4.546 9.53-13.969 20.187-19.569A22.889 22.889 0 0027 45.002c0 12.704 10.306 23.005 22.994 23.005C62.709 68.007 73 57.707 73 45.002a22.899 22.899 0 00-5.233-14.605c4.113 2.148 7.999 5.06 11.633 8.701 4.018 4.027 7.016 8.292 8.597 10.909-4.53 6.841-18.052 24-37.991 24z'></path>
    </svg>
  );
}

//ID card background that user data sits on
const VerificationContainer = styled.div`
  background-color: #1e1e2a;
  background: url(/textures/paper.png);
  background-size: cover;
  background-position: center;
  border-radius: 19px 19px 0 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  text-align: center;
  justify-content: space-evenly;
  margin: 20px;
  margin-inline: auto;
  margin-bottom: 0;
  padding: 36px;
  padding-bottom: 10px;
  width: 70%;
  box-shadow: 0px 10px 10px 2px #00000059;
`
// trying to fix the text not shrinking??
const Text = styled.h5`
  color: #444254;
  letter-spacing: 3px;
  flex-shrink: 1;
`;

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [photoStatus, setPhotoStatus] = useState('profile, camera, photo');

  const winLossRatio =
    userData?.gamesPlayed && userData?.gamesWon
      ? userData.gamesWon / userData.gamesPlayed
      : 0;

  useEffect(() => {
    fetchUserData();
  }, []);

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

  if (!user) {
    return null;
  }

  if (photoStatus === 'camera') {
    return (
      <Container>
        <StyledHeader style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2>BioData Collection Process</h2>
            <XCircle
              className='react-icon'
              onClick={() => {
                setPhotoStatus('profile');
              }}
            />
          </div>
          <h6>
            We don't save the photo, we just use it to collect
            information on the shape of your face.
          </h6>
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
        <TrophyContainer>
          <SingleTrophy />
        </TrophyContainer>
        <IdContainer>
          {userData?.facialDescriptions ? (
            <Text>CORPOVERSE OFFICIAL ID</Text>
          ) : (
            <Text >TEMPORARY CORPOVERSE ID</Text>
          )}
          <NameContainer>
            {user.picture ? (
              <img
                src={user?.picture}
                className='profile__avatar'
                style={{ height: '100%', borderRadius: '50%' }}
              // style={{ height: '14vh', width: '14vh', borderRadius: '50%' }}
              />
            ) : (
              <h1 className='alt-user-pic-large'>{user.name?.slice(0, 1)}</h1>
            )}
            <h2 className='profile__title'>{user?.name}</h2>
          </NameContainer>
          <BottomofIdContainer>
            <StatsContainer>
              {userData?.facialDescriptions ? (
                <>
                  <h5>Wins: {userData?.gamesWon}</h5>
                  <h5>Kills: {userData?.killsConfirmed}</h5>
                  <h5>Total Games: {userData?.gamesPlayed}</h5>
                  <h5>K\D: {winLossRatio}</h5>
                </>
              ) : (
                <>
                  <h5 className='bold'>CITIZEN NOT VERIFIED</h5>
                  <h5>PLEASE REGISTER BELOW</h5>
                </>
              )}
            </StatsContainer>
            <Eyeball />
          </BottomofIdContainer>
        </IdContainer>
        <VerificationContainer>
          {userData?.facialDescriptions ? (
            <h3>Citizen Verified!</h3>
          ) : (
            <h3>
              Citizen has not been processed by the CorpoReality Police.
              Please send in Biodata to participate in SOCIETY™.
            </h3>
          )}
          <h5 style={{ margin: '20px', marginInline: 0, textAlign: 'start' }}>
            Corpoverse does not recognize the authority of any other
            governing body. Your biodata will only ever be used
            for internal state related activities, and we will never
            give it to any foreign powers. You are safe with us!
          </h5>
          {userData?.facialDescriptions ? (
            <>
              <h3>Feeling Patriotic?</h3>
              <br/>
              <button onClick={() => setPhotoStatus('camera')}>
              → Reverify ←
              </button>
              <br/>
              <br/>
              <h2 className='barcode'>asdfkjflekjgldaj</h2>
            </>
          ) : (
            <>
              <h3>↓↓↓VERIFY↓↓↓ </h3>
              <br/>
              <button onClick={() => setPhotoStatus('camera')}>
              Send BioData
              </button>
              <br/>
              <br/>
              <h2 className='barcode'>asdfkjflekjgldaj</h2>
            </>
          )}
        </VerificationContainer>
      </Main>
    </Container>
  );
};

export default ProfilePage;
