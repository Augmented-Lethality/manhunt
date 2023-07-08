import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import DropDownMenu from '../components/DropDownMenu';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SocketContext from '../contexts/Socket/SocketContext';

export const StyledHeader = styled.header`
  display: flex;
  padding: 1rem;
  padding-bottom: 0;
  height: 100px;
  background-color: #FFB11A;
  border-bottom: 5px solid #4d3810;
  justify-content: space-between;
  box-shadow: 0 10px 10px 2px #00000047;
  position: relative;
`;

export const HeaderTexture = styled.div`
  position: absolute;
  bottom: 0;
  margin-inline: -1rem;
  width: 100%;
  height: 100%;
  background-image: url(/textures/header-large.png);
  background-size: cover;
  pointer-events: none;
  mix-blend-mode: darken;
  opacity: 50%;
`;

interface HeaderProps {
  page: string;
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
    <StyledHeader className='header'>
      <HeaderTexture />
      <div className='centered column'>
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
          <DropDownMenu page={page} />
        </div>
        {(page === 'Find')
          ? <h3>{users?.length} Hunter{users?.length !== 1 ? 's' : ''} Available for Contract</h3>
          : <h1 style={{ fontSize: `${page.length/2}rem` }}>{page}</h1>
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