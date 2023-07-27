import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { UserPlus } from 'react-feather';
import Loading from '../components/Loaders/Loading';
import FriendRequestPopup from '../components/Popups/FriendRequest';
import IdCardOtherUser from '../components/ProfilePieces/IdCardOtherUser';

import OtherSavedTrophies from '../components/Trophies/OtherSavedTrophies';

type ProfileData = {
  authId: string;
  gamesPlayed: number;
  gamesWon: number;
  killsConfirmed: number;
  image: string;
};

const OtherUserProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const { username } = useParams()
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    authId: '',
    gamesPlayed: 0,
    gamesWon: 0,
    killsConfirmed: 0,
    image: 'string'
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get<ProfileData>(`/users/name/${username}`);
      console.log(res.data)
      setProfileData(res.data)
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };


  const sendFriendRequest = async (username: string) => {
    try {
      const res = await axios.post(`/friends`, {
        userId: user?.sub,
        friendName: username,
      });
      // console.log(res.data.message)
      return { message: res.data.message };
    } catch (err: any) {
      console.error('Error adding friend', err.response.data.message);
      return { message: err.response.data.message };
    }
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!profileData.authId.length && !loading) {
    return <h1>User Not Found</h1>
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Header page='Hunter' />
      <Main>
        {username && profileData.authId.length &&
          <>
            <IdCardOtherUser profileData={profileData} username={username} />
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', marginTop: '10px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', margin: '2vh', alignItems: 'start' }}>
                <FriendRequestPopup username={username} sendFriendRequest={sendFriendRequest} />
              </div>
            </div>
            <h2 style={{ marginTop: '12px', textAlign: 'center' }}>Trophy Showcase</h2>
            <OtherSavedTrophies id={0} name={''} description={''} createdAt={''} dimension={0} dimensionTwo={0} dimensionThree={0} color={''} shape={''} tubularSegments={0} tubeWidth={0} />
          </>
        }
      </Main>
    </>
  );
};

export default OtherUserProfilePage;
