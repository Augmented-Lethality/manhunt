import React, { useState, useContext, useEffect, useRef } from 'react';
import SocketContext from '../../contexts/Socket/SocketContext';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';


const TimeListContainer = styled.ul<{ open: boolean }>`
  display: ${({ open }) => (open ? 'inline-block' : 'none')};
  font-size: 2em;
  max-height: 245px;
  width: 175px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  position: relative;
  background-color: #0f0f16;
`;

const TimeItem = styled.li<{ selected: boolean }>`
  padding: 2px;
  cursor: pointer;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  transition: background .2s ease-out;
  outline: none;
  background: ${({ selected }) => (selected ? '#6e6b8c' : 'transparent')};
  color: ${({ selected }) => (selected ? 'white' : '#6e6b8c')};
`;

const SelectedTime = styled.div`
  display: inline-block;
  font-size: 2em;
  cursor: pointer;
  text-align: center;
  width: 172px;
  position: relative;
`;

const ArrowContainer = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
`;

const Arrow = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? 'inline-block' : 'none')};
  cursor: pointer;
`;

const TimeList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('03:00');
  const listRef = useRef<HTMLUListElement>(null);
  const scrollValues = ['01', '02', '03', '04', '05', '07', '10', '15', '20', '30', '45', '60'];

  const selectedIndex = scrollValues.indexOf(selected.split(':')[0]);

  const handleArrowClick = (direction: 'up' | 'down') => {
    if (direction === 'up' && selectedIndex > 0) {
      setSelected(`${scrollValues[selectedIndex - 1]}:00`);
    } else if (direction === 'down' && selectedIndex < scrollValues.length - 1) {
      setSelected(`${scrollValues[selectedIndex + 1]}:00`);
    }
  };

  useEffect(() => {
    if (listRef.current) {
      const currentList = listRef.current;

      const handleScroll = (e: WheelEvent) => {
        e.preventDefault();
        currentList.scrollTop += e.deltaY;
      };

      currentList.addEventListener('wheel', handleScroll);

      return () => {
        currentList.removeEventListener('wheel', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (listRef.current && open) {
      if (selectedIndex > -1) {
        listRef.current.children[selectedIndex].scrollIntoView();
      }
    }
  }, [open, selected]);

  return (
    <>
      {!open && (
        <SelectedTime onClick={() => setOpen(!open)}>
          <ArrowContainer>
            <Arrow visible={selectedIndex > 0} onClick={() => handleArrowClick('up')}>
              ▲
            </Arrow>
            {selected}
            <Arrow
              visible={selectedIndex < scrollValues.length - 1}
              onClick={() => handleArrowClick('down')}
            >
              ▼
            </Arrow>
          </ArrowContainer>
        </SelectedTime>
      )}
      <TimeListContainer open={open} ref={listRef}>
        {scrollValues.map((val, index) => (
          <TimeItem
            selected={`${val}:00` === selected}
            key={index}
            onClick={() => {
              setSelected(`${val}:00`);
              setOpen(false);
            }}
          >
            {`${val}:00`}
          </TimeItem>
        ))}
      </TimeListContainer>
    </>
  );
};

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
    <>
      <label htmlFor="time">Select time:</label>
      <select id="time" value={selectedTime} onChange={handleTimeChange}>
        <option value={1}>1:00</option>
        <option value={5}>5:00</option>
        <option value={10}>10:00</option>
        <option value={20}>20:00</option>
        <option value={30}>30:00</option>
        <option value={45}>45:00</option>
        <option value={60}>60:00</option>

      </select>
      {/* <TimeList /> */}
      <div>Selected time: {formatTime(selectedTime)}</div>
    </>
  );
};

export default TimerInput;
