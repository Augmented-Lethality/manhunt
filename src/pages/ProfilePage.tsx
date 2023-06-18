import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ButtonToHome } from '../components/Buttons';
import CreateFaceDescriptions from '../components/CreateFaceDescriptions';

export type UserData = {
  username: string;
  email: string;
  authId: string;
  gamesPlayed: number;
  gamesWon: number;
  killsConfirmed: number;
  facialDescriptions: Array<number> | null
  // Add other user data properties as needed
};

const ProfilePage: React.FC<{ userData: UserData | null }> = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserData>(`/Users/${user?.sub}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    if (isAuthenticated && user) {
      fetchUserData();
    }
  }, []);

  console.log(userData, 'USeRdatA');

  if (!user) {
    return null;
  }

  if(isVerifying){
    return (
      <CreateFaceDescriptions
        setIsVerifying={setIsVerifying}
        username={user.name}
        userID={user.sub}
        setUser={setUserData}/>
    )
  }

  return (
    <div
      className='content-layout'
      style={{
        textAlign: 'center',
        padding: '0px',
        margin: '0px',
        backgroundColor: '#fcf18d',
        minHeight: '100vh', // Fill the entire screen vertically
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#6e6b8c',
        fontWeight: 'bold',
      }}
    >
      <h1 id='page-title' className='content__title'>
        Profile
      </h1>
      <div className='content__body'>
        <p id='page-description'>
          <span></span>
          <span>
            <strong></strong>
          </span>
        </p>
        <div className='profile-grid'>
          <div
            className='profile__header'
            style={{
              display: 'flex',
              margin: 'auto',
              width: '100%',
              backgroundColor: '#fcf18d',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ marginRight: '20px' }}>
              <img
                src={user.picture}
                alt='Profile'
                className='profile__avatar'
              />
            </div>
            <div>
              <h2 className='profile__title'>{user.name}</h2>
              <span className='profile__description'>
                {user.email}
                {/* <ButtonToUpdateEmail /> */}
              </span>
            </div>
          </div>
            {userData?.facialDescriptions ? (
              <div className='profile_verification'>
                <h2>Citizen has been verified. The CorpoVerse thanks you for your cooperation.</h2>
                <button onClick={()=>setIsVerifying(true)}>Feeling Patriotic? Reverify</button>
              </div>
            ) : (
              <div className='profile_verification'>
                <h3>Citizen has not been processed by the CorpoReality Police.</h3>
                <h3>Please send in Biodata to participate in SOCIETY™.</h3>
                <button onClick={()=>setIsVerifying(true)}>Send BioData</button>
              </div>
            )}
          <div className='profile__details'>
            <h2>Games Played: {userData?.gamesPlayed}</h2>
            <h2>Games Won: {userData?.gamesWon}</h2>
            <h2>Kills Confirmed: {userData?.killsConfirmed}</h2>
            {/* <h2>userData from database</h2>
            <p>{JSON.stringify(userData, null, 2)}</p> */}
            <ButtonToHome />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
