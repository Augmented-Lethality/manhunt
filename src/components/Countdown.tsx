import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface CountdownProps {
  initialCount: number;
  id: string;
}

const CountdownContainer = styled.div`
    position: absolute;
    color: #ffffffa1;
    font-size: 2.5rem;
    top: 4.2vh;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const Countdown: React.FC<CountdownProps> = ({ initialCount, id }) => {
  const [minutes, setMinutes] = useState(Math.floor(initialCount / 60));
  const [seconds, setSeconds] = useState(initialCount % 60);

  useEffect(() => {
    const timerId = setInterval(() => {
      if(seconds > 0) {
        setSeconds(seconds - 1);
      } else if(minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [minutes, seconds]);

  return (
    <CountdownContainer id={id}>
      {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
    </CountdownContainer>
  );
};

export default Countdown;
