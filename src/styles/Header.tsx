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
  height: 100px;
  background-color: #FFB11A;
  border-bottom: 5px solid #4d3810;
  justify-content: end;
  box-shadow: 0 10px 10px 2px #00000047;
  position: relative;
`;

export const HeaderTextureLarge = styled.div<{ isPhone: boolean }>`
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
  display: ${(props) => (props.isPhone ? 'none' : 'block')}; /* Show for phone screens */
`;

export const HeaderTextureSmall = styled.div<{ isPhone: boolean }>`
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
  display: ${(props) => (props.isPhone ? 'block' : 'none')}; /* Show for phone screens */
`;

const Crosshairs = () => {
  const [scale, setScale] = useState(window.innerWidth / 600);
  const isPhoneScreen = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth / 600)
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4e4c61"
      strokeWidth="1"
      style={{
        position: 'absolute',
        top: '55%',
        left: '15%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        pointerEvents: 'none',
        mixBlendMode: 'overlay'
      }}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" strokeWidth=".5" />
      <line x1="22" y1="12" x2="20" y2="12" />
      <line x1="4" y1="12" x2="2" y2="12" />
      <line x1="12" y1="4" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="20" />
    </svg>
  );
}

const LogoWithCrossHairs = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();

  const handleHome = () => {
    navigate('/home');
  }

  const fontSize = window.innerWidth > 750 ? '55px' : '7vw'

  return (
    <div style={{
      overflow: 'hidden',
      height: '132px',
      width: '100vw',
      maxWidth: '500px',
      position: 'absolute',
      top: 0,
      left: 0,
      pointerEvents: 'none' }}>
      <Crosshairs />
      <div style={{
        position: 'absolute',
        top: '55%',
        left: '15%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mixBlendMode: 'hard-light'
      }}>
        <h1
          style={{ fontSize: fontSize, margin: 0, pointerEvents: 'auto' }}
          className='logo'
          onClick={handleHome}>MAN</h1>
        <h1
          style={{ fontSize: fontSize, margin: 0, pointerEvents: 'auto' }}
          className='logo'
          onClick={handleHome}>HUNT</h1>
      </div>
    </div>
  )
}

interface HeaderProps {
  page: string;
  users?: Array<Object> | null;
}

// PLEASE KEEP THIS SOCKET FUNCTION WHEN USING A GOING HOME BUTTON
export const Header: React.FC<HeaderProps> = ({ page, users }) => {
  const isPhoneScreen = useMediaQuery({ query: '(max-width: 380px)' });
  const navigate = useNavigate();
  const { user } = useAuth0();

  return (
    <StyledHeader>
      <HeaderTextureLarge isPhone={isPhoneScreen} />
      <HeaderTextureSmall isPhone={isPhoneScreen} />
      <LogoWithCrossHairs/>
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
          : <h1 style={{fontSize: '10vw'}}>{page}</h1>
        }
      </div>
    </StyledHeader>
  );
}


interface GameHeaderProps {
  children?: ReactNode;
}

const leftOvalPosition = `${window.innerWidth / 2}px`
const StyledOval = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100px;
  background-color: #2f303a;
  border-radius: 50%;
  border: 2px solid #222225;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 65px;
  left: ${leftOvalPosition};
`;

export const GameHeader: React.FC<GameHeaderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { LeaveGame } = useContext(SocketContext);

  const handleHome = () => {
    LeaveGame(user);
    navigate('/home');
  }

  return (
    <StyledHeader>
      <StyledOval>{children}</StyledOval>
      <DropDownMenu page={'Game'} />
    </StyledHeader>
  );
}

export const Footer = styled.footer`
  background-color: #3F404F;
  border-top: 1px solid #202026;
  height: 60px;
  padding: 1rem;
  position: absolute;
  display: flex;
  bottom: 0px;
  width: -webkit-fill-available;
`;