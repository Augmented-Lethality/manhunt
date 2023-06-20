import React, { useState, useEffect } from 'react';

interface CountdownProps {
  initialCount: number;
}

const Countdown: React.FC<CountdownProps> = ({ initialCount }) => {
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
    <div>
      {`again${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
    </div>
  );
};

export default Countdown;