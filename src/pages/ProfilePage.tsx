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
    <div className='content-layout' style={{ textAlign: 'center', fontWeight: 'bold',color: '#6e6b8c' }}>
      <h1 id='page-title' className='content__title'>Profile</h1>
      <div className='content__body'>
        <div className='profile-grid'>
          <div style={{display: 'flex', alignItems:'center'}}>
            <img
              src={user.picture}
              alt='Profile'
              className='profile__avatar'
              style={{height: '14vh', width: '14vh'}}
            />
            <div style={{display:'flex', flexDirection:'column', margin: '2vh', alignItems: 'start'}}>
              <h2 className='profile__title'>{user.name}</h2>
              <span className='profile__description'>
                {user.email}
                {/* <ButtonToUpdateEmail /> */}
              </span>
            </div>
          </div>
          {userData?.facialDescriptions ? (
            <div className='profile_verification'>
              <p style={{textAlign:'start', margin:'3vh'}}>
                Citizen has been verified. The CorpoVerse thanks you for your cooperation.
              </p>
              <button onClick={()=>setIsVerifying(true)}>Feeling Patriotic? Reverify</button>
            </div>
          ) : (
            <div className='profile_verification'>
              <h3>Citizen has not been processed by the CorpoReality Police.</h3>
              <h3>Please send in Biodata to participate in SOCIETY™.</h3>
              <button style={{background:'#6e6b8c', color: 'white'}} onClick={()=>setIsVerifying(true)}>Send BioData</button>
            </div>
          )}
          <div className='profile__details'>
            <br/>
            <br/>
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
