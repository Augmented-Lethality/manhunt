// import { useAuth0 } from '@auth0/auth0-react';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Container } from '../styles/Container';
// import { Header } from '../styles/Header';
// import { Main } from '../styles/Main';
// export type UserData = {
//   username: string;
//   email: string;
//   authId: string;
//   gamesPlayed: number;
//   gamesWon: number;
//   killsConfirmed: number;
//   facialDescriptions: Array<number> | null
//   // Add other user data properties as needed
// };

//  const OtherUserProfilePage: React.FC = () => {
//   // const { user, isAuthenticated } = useAuth0();
//   // const { OtherUserUsername } = useParams();
//    const [OtherUserData, setOtherUserData] = useState<UserData | null>(null);

//   // useEffect(() => {
//   //     fetchUserData();
//   // }, []);

//   // const fetchUserData = async () => {
//   //   try {
//   //     const res = await axios.get<UserData>(`/Users/${OtherUserUsername}`)
      
//   //     setOtherUserData(res.data);
//   //   } catch (error) {
//   //     console.error('Error fetching user data:', error);
//   //   }
//   // };

//   // if (!isAuthenticated) {
//   //   return null;
//   // }

//    return (
//      <Container>
//   //     <Header page='Profile' />
//   //     <Main>
//   //       <div className='content__body'>
//   //         <div className='profile-grid'>
//   //           <div style={{ display: 'flex', alignItems: 'center' }}>
//   //             {user.picter ? (
//   //               <img
//   //                 src={user.picture}
//   //                 className='profile__avatar'
//   //                 style={{ height: '14vh', width: '14vh', borderRadius:'50%'}}
//   //               />
//   //             ) : (
//   //               <h1 className='alt-user-pic-large'>
//   //                 {user.name?.slice(0, 1)}
//   //               </h1>
//   //             )}
//   //             <div style={{ display: 'flex', flexDirection: 'column', margin: '2vh', alignItems: 'start' }}>
//   //               <h2 className='profile__title'>{user.name}</h2>
//   //               <span className='profile__description'>
//   //               </span>
//   //             </div>
//   //           </div>
//   //           <div className='profile__details'>
//   //             <br />
//   //             <br />
//   //             <h2>Games Played: {OtherUserData?.gamesPlayed}</h2>
//   //             <h2>Games Won: {OtherUserData?.gamesWon}</h2>
//   //             <h2>Kills Confirmed: {OtherUserData?.killsConfirmed}</h2>
//   //           </div>
//   //         </div>
//   //       </div>
//   //     </Main>
//      </Container>
//    );
//  };

// export default OtherUserProfilePage;
