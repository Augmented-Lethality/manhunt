import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { UserPlus } from 'react-feather';
import Loading from '../components/Loaders/Loading';

type ProfileData = {
  authId: string;
  gamesPlayed: number;
  gamesWon: number;
  killsConfirmed: number;
  image: string;
};

const OtherUserProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const { username } = useParams();
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

  const addFriend = async () => {
    try {
      const res = await axios.post(`/friends`, {
        userId: user?.sub,
        friendId: profileData?.authId,
        status: 'pending'
      });
      if (res.status === 201) {
        // console.log(res.data)
      }
    } catch (err) {
      console.error('Error adding friend', err);
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
            <UserPlus className='react-icon' onClick={addFriend} />
          </div>
        </div>
        <div className='profile__details' style={{ marginLeft: '20px' }}>
          <br />
          <br />
          <h2>Games Played: {profileData?.gamesPlayed}</h2>
          <h2>Games Won: {profileData?.gamesWon}</h2>
          <h2>Kills Confirmed: {profileData?.killsConfirmed}</h2>
        </div>
      </Main>
    </>
  );
};

export default OtherUserProfilePage;
