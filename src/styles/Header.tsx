import React, { ReactNode, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import DropDownMenu from '../components/DropDownMenu';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SocketContext from '../contexts/Socket/SocketContext';

export const StyledHeader = styled.header`
  display: flex;
  padding: 2rem;
  padding-top: 1rem;
  height: 175px;
  justify-content: space-between;
  position: fixed;
  top: 0;
  width: 100%;
  background-image: url(/textures/header-small.png);
  background-size: cover;
  background-position: left bottom;
  box-sizing: border-box;
  z-index: 1;
`;

interface HeaderProps {
  page?: string;
  users?: Array<Object> | null;
}

// PLEASE KEEP THIS SOCKET FUNCTION WHEN USING A GOING HOME BUTTON
export const Header: React.FC<HeaderProps> = ({ page, users }) => {
  const isPhoneScreen = useMediaQuery({ query: '(max-width: 380px)' });
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/home');
  }

  const { user } = useAuth0();

  return (
    <StyledHeader>
      <div style={{marginBottom:'21px', marginLeft:'-10px'}} className='centered column'>
        <h1 className='logo' onClick={handleHome}>MAN</h1>
        <h1 className='logo' onClick={handleHome}>HUNT</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
          <img
            src={user?.picture}
            alt='Profile'
            className='profile__avatar'
            onClick={() => { navigate('/profile') }}
            style={{ height: '3rem', borderRadius: '50%', marginRight: '10px' }} />
          <DropDownMenu page={page || ''} />
        </div>
        {(page === 'Find')
          ? <h3>{users?.length} Hunter{users?.length !== 1 ? 's' : ''} Available for Contract</h3>
          : <h1 style={{ marginRight: '-20px', }}>{page}</h1>
        }
      </div>
    </StyledHeader>
  );
}

export const GameStyledHeader = styled.header`
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  position: relative;
  margin-inline: auto;
  margin-bottom: 20px;
  width: 80%;
`;

interface GameHeaderProps {
  children?: ReactNode;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { LeaveGame } = useContext(SocketContext);

  return (
    <GameStyledHeader className="digital digital-container">
      {children}
      <DropDownMenu page={'Game'} />
    </GameStyledHeader>
  );
}