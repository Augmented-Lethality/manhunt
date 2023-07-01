import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import SocketContext from '../contexts/Socket/SocketContext';
import { useAuth0 } from "@auth0/auth0-react";

const CountdownContainer = styled.div`
  position: absolute;
  color: #ffffffa1;
  font-size: 10vw;
  top: 21vw;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Countdown: React.FC = () => {
  const { games } = useContext(SocketContext).SocketState;
  const { AddGameStats, UpdateGameStatus } = useContext(SocketContext);

  const { user } = useAuth0();

  const [initialCount, setInitialCount] = useState(-1);
  const [minutes, setMinutes] = useState(-1);
  const [seconds, setSeconds] = useState(-1);

  useEffect(() => {

    // calculating the amount of seconds since the game started
    const elapsedSeconds = Math.floor((Date.now() - Number(games[0].timeStart)) / 1000);
    // sets what time the timer should start at since the start of the game, handles users disconnecting
    const calculatedInitialCount = (Number(games[0].timeConstraints) * 60) - elapsedSeconds;

    // set the initial count and start the mins/seconds countdown
    setInitialCount(calculatedInitialCount);
    setMinutes(Math.floor(calculatedInitialCount / 60));
    setSeconds(calculatedInitialCount % 60);
  }, [games]);

  // subtract a second from the initial countdown after every second
  useEffect(() => {
    if (initialCount > 0) {
      const countdownInterval = setInterval(() => {
        setInitialCount(prevCount => prevCount - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [initialCount]);

  // when the initial count is changed, update the mins and seconds
  useEffect(() => {
    setMinutes(Math.floor(initialCount / 60));
    setSeconds(initialCount % 60);
  }, [initialCount]);

  useEffect(() => {
    if (minutes === 0 && seconds === 0 && games[0].status !== 'complete' && games[0].hunted === user?.sub) {
      AddGameStats(user);
      UpdateGameStatus(user, 'complete')
    }
  }, [seconds]);


  return (
    <CountdownContainer>
      {minutes > -1 && `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
    </CountdownContainer>
  );
};

export default Countdown;
