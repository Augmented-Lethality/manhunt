import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { UserPlus } from 'react-feather';
import Loading from '../components/Loaders/Loading';
import FriendRequestPopup from '../components/Popups/FriendRequest';

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
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get<ProfileData>(`/users/name/${username}`);
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

  if (!profileData && !loading) {
    return <h1>User Not Found</h1>
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Header page='Profile' />
      <Main>
        {username &&
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', marginTop: '10px' }}>
              {profileData?.image ? (
                <img
                  src={profileData?.image}
                  className='profile__avatar'
                  style={{ height: '14vh', width: '14vh', borderRadius: '50%' }}
                />
              ) : (
                <h1 className='alt-user-pic-large'>
                  {username?.slice(0, 1)}
                </h1>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', margin: '2vh', alignItems: 'start' }}>
                <h2 className='profile__title'>{username}</h2>
                <FriendRequestPopup username={username} sendFriendRequest={sendFriendRequest} />
              </div>
            </div>
            <div className='profile__details' style={{ marginLeft: '20px' }}>
              <br />
              <br />
              <h2>Games Played: {profileData?.gamesPlayed}</h2>
              <h2>Games Won: {profileData?.gamesWon}</h2>
              <h2>Kills Confirmed: {profileData?.killsConfirmed}</h2>
            </div>
          </>
        }
      </Main>
    </>
  );
};

export default OtherUserProfilePage;
