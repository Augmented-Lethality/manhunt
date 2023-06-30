import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface CountdownProps {
  initialCount: number;
}

const CountdownContainer = styled.div`
  position: relative;
  color: #9e9da6;
  font-size: 10vw;
`;

const Countdown: React.FC<CountdownProps> = ({ initialCount}) => {
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
    <CountdownContainer>
      {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
    </CountdownContainer>
  );
};

export default Countdown;
