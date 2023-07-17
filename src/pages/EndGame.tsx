import React, { useEffect, useState, useContext, lazy, Suspense } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import SocketContext from '../contexts/Socket/SocketContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { ButtonToHome } from '../styles/Buttons';

import PhoneLoader from '../components/Loaders/PhoneLoader';
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



const TrophyGenerator = lazy(() => import('../components/Trophies/TrophyGenerator'));

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
          `Target aquired thanks to you, ${player.username}.`
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

  return (
    <>
      <Header page={'Game Over'} />
      <Main>

        {gameOverMessage.length ? (
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
        ) :
          <PhoneLoader />}
        <div className='glassmorphism column centered padded margined'>
          Justice can wait, time to
          <button>
            GO HOME
          </button>
          Put more scum in their place?
          <button>
            GO AGAIN
          </button>
        </div>
      </Main>
    </ >
  );

};

export default EndGame;
