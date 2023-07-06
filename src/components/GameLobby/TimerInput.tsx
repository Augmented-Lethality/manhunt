import React, { useState, useContext, useEffect, useRef } from 'react';
import SocketContext from '../../contexts/Socket/SocketContext';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';

const TimeListContainer = styled.ul<{ open: boolean }>`
  display: ${({ open }) => (open ? 'inline-block' : 'none')};
  font-size: 2em;
  height: 100%;
  width: 175px;
  padding: 0;
  overflow: hidden;
`;

// TimeItemComponent filters out spacer prop to remove a browser error
const TimeItemComponent = ({ spacer, ...props }) => <li {...props} />;
const TimeItem = styled(TimeItemComponent)<{ selected: boolean, spacer?: boolean }>`
  padding: 2px;
  cursor: pointer;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  transition: background .2s ease-out;
  outline: none;
  background: ${({ selected }) => (selected ? '#6e6b8c' : 'transparent')};
  color: ${({ selected }) => (selected ? 'white' : '#6e6b8c')};
  height: ${({ spacer }) => (spacer ? '1.5rem' : 'auto')};
`;

const SelectedTime = styled.div`
  font-size: 2em;
  text-align: center;
  width: 175px;
  color: green;
  font-family: 'VT323';
`;

const ArrowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TimeDisplayContainer = styled.div`
  background: black;
  border: 2px solid #4d4d4d;
  border-radius: 20px;

`

// TimeItemComponent filters out 'visible' prop to remove a browser error
const ArrowComponent = ({ visible, ...props }) => <div {...props} />;
const Arrow = styled(ArrowComponent)<{ visible: boolean }>`
  color: ${({ visible }) => (visible ? '#6e6b8c' : 'transparent')};
  user-select: none;
`;

const TimerInput: React.FC = () => {
  const { AddGameDuration } = useContext(SocketContext);
  const { user } = useAuth0();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('03:00');
  const listRef = useRef<HTMLUListElement>(null);
  const scrollValues = ['01', '02', '03', '04', '05', '07', '10', '15', '20', '30', '45', '60'];

  const selectedIndex = scrollValues.indexOf(selected.split(':')[0]);

  //Send the selected time to the socket instance
  useEffect(() => {
    AddGameDuration(Number(selected.slice(0, 2)), user);
  }, [selected])

  //Allow clicking the arrows to change the time
  const handleArrowClick = (direction: 'up' | 'down') => {
    if (direction === 'down' && selectedIndex > 0) {
      setSelected(`${scrollValues[selectedIndex - 1]}:00`);
    } else if (direction === 'up' && selectedIndex < scrollValues.length - 1) {
      setSelected(`${scrollValues[selectedIndex + 1]}:00`);
    }
  };

  //Allow scrolling through the menu
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

  //make sure when the menu opens you can see the selected item
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
        <SelectedTime >
          <TimeDisplayContainer onClick={() => setOpen(!open)}>
            Game Time - {selected}
          </TimeDisplayContainer>
          <ArrowContainer>
            <button className='plastic-button' onClick={() => handleArrowClick('down')}>◁</button>
            <button className='plastic-button' onClick={() => handleArrowClick('up')}>▷</button>
          </ArrowContainer>
          {/* <Arrow
            visible={selectedIndex < scrollValues.length - 1}
            onClick={() => handleArrowClick('down')}
          >
            ▼
          </Arrow> */}
        </SelectedTime>
      )}
      <TimeListContainer open={open} ref={listRef}>
        <TimeItem spacer selected={false}/>
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
        <TimeItem spacer selected={false} />
      </TimeListContainer>
    </>
  );
};

export default TimerInput;
