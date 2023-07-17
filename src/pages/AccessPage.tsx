import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import SocketContext from '../contexts/Socket/SocketContext';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { useFontSize } from '../contexts/FontSize';
import styled from 'styled-components';

import PhoneLoader from '../components/Loaders/PhoneLoader';

import AccessCheck from '../components/GameLobby/AccessCheck';
import { useNavigate } from 'react-router-dom';

const AccessChecksContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-items: center;
`;

const AccessCheckContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(5px);
  box-shadow: 0 0 3px rgba(32, 32, 32, 0.5);
  border-radius: 4px;
  margin: 20px;
  height: 100%;
  overflow: auto;
  justify-items: center;
`;

const AccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { info } = location.state;

  const { users } = useContext(SocketContext).SocketState;
  const { CreateGame } = useContext(SocketContext);
  const [fontSize, setFontSize] = useFontSize();

  const [joining, setJoining] = useState(false);

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= 3) {
      switch (info) {
        case 'create':
          CreateGame();
          setJoining(true);
          break;
        case 'join':
          navigate('/findGame');
          break;
      }
    }
  }, [count])

  return (
    <>
      <Header page={'Access'} users={users} />
      <Main>
        {joining ? <PhoneLoader /> : (
          <AccessChecksContainer>
            <AccessCheckContainer>
              <AccessCheck type={'Camera'} setCount={setCount} count={count} />
            </AccessCheckContainer>
            <AccessCheckContainer>
              <AccessCheck type={'Location'} setCount={setCount} count={count} />
            </AccessCheckContainer>
            <AccessCheckContainer>
              <AccessCheck type={'Orientation'} setCount={setCount} count={count} />
            </AccessCheckContainer>
          </AccessChecksContainer>

        )}
      </Main>
    </>
  );
};

export default AccessPage;
