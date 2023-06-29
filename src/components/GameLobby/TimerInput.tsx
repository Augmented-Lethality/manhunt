import React, { useState, useContext, useEffect } from 'react';
import SocketContext from '../../contexts/Socket/SocketContext';
import { useAuth0 } from '@auth0/auth0-react';


const TimerInput: React.FunctionComponent = () => {
  const [selectedTime, setSelectedTime] = useState(0);
  const { AddGameDuration } = useContext(SocketContext);
  const { user } = useAuth0();

  const handleTimeChange = (event) => {
    const { value } = event.target;
    setSelectedTime(Number(value));

  };

  useEffect(() => {
    if (selectedTime !== 0) {
      AddGameDuration(selectedTime, user);

    }
  }, [selectedTime])

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <label htmlFor="time">Select time:</label>
      <select id="time" value={selectedTime} onChange={handleTimeChange}>
        <option value={1}>1 minute</option>
        <option value={5}>5 minutes</option>
        <option value={10}>10 minutes</option>
        <option value={20}>20 minutes</option>
        <option value={30}>30 minutes</option>
        <option value={45}>45 minutes</option>
        <option value={60}>1 hour</option>

      </select>
      <div>Selected time: {formatTime(selectedTime)}</div>
    </div>
  );
};

export default TimerInput;
