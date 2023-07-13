import React, { useEffect, useState, useContext, lazy, Suspense } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import SocketContext from '../contexts/Socket/SocketContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { ButtonToHome } from '../styles/Buttons';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 10px;
  margin-inline: 20px;
  background-color: #1a1b22;
  padding: 20px;
  border-radius: 10px;
  justify-content: space-around;
  border: 2px solid #e6a733;
`;



const TrophyGenerator = lazy(() => import('../components/TrophyGenerator'));

const EndGame: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { games, users, player } = useContext(SocketContext).SocketState;
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [winner, setWinner] = useState(false);

  useEffect(() => {
    if (games.length > 0) {
      // they won and were not the victim
      if (games[0].winnerId === player.authId && games[0].hunted !== player.authId) {
        setGameOverMessage(
          `Great work, ${player.username}.\nYour skip tracing gained you a bounty.`



          // array, split the sentences







        );
        // user is a winner
        setWinner(true);
        // they won and were being hunted
      } else if (
        games[0].winnerId === player.authId &&
        games[0].hunted === player.authId
      ) {
        setGameOverMessage(
          `Congratulations citizen. Here is your reward.`
        );
        // user is a winner
        setWinner(true);
        // lost and were being hunted
      } else if (
        games[0].winnerId !== player.authId &&
        games[0].hunted === player.authId
      ) {
        setGameOverMessage(
          `C'mon ${player.username}, you seriously let these guys catch you?`
        );
        // lost and were a hunter
      } else if (
        games[0].winnerId !== player.authId &&
        games[0].hunted !== player.authId
      ) {
        setGameOverMessage(
          `${player.username}, bounty hunters catch the bounty.\nGet back in there and try again!`
        );
      }
    }
  }, [games]);

  if (!gameOverMessage.length) {
    return <img
      src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjFyb2Z6ODR3b3UzaDc4YXMwMWNsMjhqaTY1d2d5em52bTduMnNnZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CdhxVrdRN4YFi/giphy.gif"
      alt="Game Over GIF"
      style={{ width: '400px', height: '400px', marginBottom: '20px' }}
    />
  }

  return (
    <>
      <Header page={''} users={users} />
      <Main>
        <h1 className='end-main' style={{ fontSize: '3em', marginBottom: '2px', marginTop: '15px', textAlign: 'center', }}>GAME OVER</h1>
        <MessageContainer className='glassmorphism'>
          <h3 className='game-over' style={{ color: 'white', fontSize: '1.5em', marginBottom: '10px', paddingLeft: '20px', paddingRight: '20px', whiteSpace: 'pre-line', marginTop: '0px', }}>{gameOverMessage}</h3>
          {winner ? (
            <div className='trophy-container-end' style={{
              width: '400px', height: '300px', marginBottom: '8px', display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <Suspense fallback={<div>Loading Trophy...</div>}>
                <TrophyGenerator />
              </Suspense>
            </div>
          ) : null}
        </MessageContainer>
        <ButtonToHome />
      </Main>
    </ >
  );

};

export default EndGame;
