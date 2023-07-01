import React, { ReactNode, useContext } from 'react';
import styled from 'styled-components';
import DropDownMenu from '../components/DropDownMenu';
import { useNavigate } from 'react-router-dom';
import User from 'react-feather/dist/icons/user';
import Home from 'react-feather/dist/icons/home';
import { useAuth0 } from '@auth0/auth0-react';
import { ButtonToHome } from '../components/Buttons';
import SocketContext from '../contexts/Socket/SocketContext';
import { Crosshair } from 'react-feather';


export const StyledHeader = styled.header`
  display: flex;
  padding: 1rem;
  height: 100px;
  background-color: #37394a;
  border-bottom: 1px solid #202026;
  justify-content: end;
  position: relative;
  overflow: hidden;
`;

const Crosshairs = () => {
  const scale = window.innerWidth / 600;
  
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
        pointerEvents: 'none'
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
  const { LeaveGame } = useContext(SocketContext);

  const handleHome = () => {
    LeaveGame(user);
    navigate('/home');
  }

  const fontSize = window.innerWidth > 750 ? '55px' : '7vw'

  return (
    <>
      <Crosshairs />
      <div style={{
        position: 'absolute',
        top: '55%',
        left: '15%',
        transform: 'translate(-50%, -50%)',
        display:'flex',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent:'center'
      }}>
        <h1
          style={{fontSize:fontSize, margin: 0}}
          className='logo'
          onClick={handleHome}>MAN</h1>
        <h1
          style={{fontSize:fontSize, margin: 0}}
          className='logo'
          onClick={handleHome}>HUNT</h1>
      </div>
    </>
  )
}

export function HomeHeader({ users }) {
  const navigate = useNavigate();
  const { user } = useAuth0();
  
  return (
    <StyledHeader>
      <LogoWithCrossHairs />
      <div style={{display:'flex', flexDirection:'column'}}>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'end'}}>
          <img
            src={user?.picture}
            alt='Profile'
            className='profile__avatar'
            onClick={() => { navigate('/profile') }}
            style={{ height: '3rem', borderRadius:'50%', marginRight:'10px'}}/>
          <DropDownMenu>
            <p onClick={() => { navigate('/profile') }}><User />profile</p>
          </DropDownMenu>
        </div>
        <h3>Users Online: {users.length}</h3>
      </div>
    </StyledHeader>
  );
}

// PLEASE KEEP THIS SOCKET FUNCTION WHEN USING A GOING HOME BUTTON
export function Header({ page }) {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { LeaveGame } = useContext(SocketContext);

  const handleHome = () => {
    LeaveGame(user);
    navigate('/home');
  }

  return (
    <StyledHeader>
      <LogoWithCrossHairs />
      <div style={{display:'flex', flexDirection:'column'}}>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'end'}}>
        <img
            src={user?.picture}
            alt='Profile'
            className='profile__avatar'
            onClick={() => { navigate('/profile') }}
            style={{ height: '3rem', borderRadius:'50%', marginRight:'10px'}}/>
          <DropDownMenu>
            <p onClick={handleHome}><Home />home</p>
          </DropDownMenu>
        </div>
        <h1>{page}</h1>
      </div>
    </StyledHeader>
  );
}


interface GameHeaderProps {
  children?: ReactNode;
}

const StyledOval = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100px;
  background-color: #2f303a;
  border-radius: 50%;
  border: 2px solid #222225;
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
      <Home className='react-icon-logo' onClick={handleHome} />
      <StyledOval>{children}</StyledOval>
      <DropDownMenu>
        <p onClick={handleHome}><Home />home</p>
      </DropDownMenu>
    </StyledHeader>
  );
}

export const Footer = styled.footer`
  background-color: #3F404F;
  border-top: 2px solid #202026;
  height: 60px;
  padding: 1rem;
  position: absloute;
  bottom: 0px;
`;


// const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 600"><defs><filter id="uuid-364a1b21-ff76-46ea-9649-0ffd94dc9e32" filterUnits="userSpaceOnUse"><feOffset dx="0" dy="14"/><feGaussianBlur result="uuid-f8a21010-bcb6-463e-b49c-d72f877ef816" stdDeviation="0"/><feFlood flood-color="#1c1c2d" flood-opacity="1"/><feComposite in2="uuid-f8a21010-bcb6-463e-b49c-d72f877ef816" operator="in"/><feComposite in="SourceGraphic"/></filter></defs><path fill="#40404c" filter="url(#uuid-364a1b21-ff76-46ea-9649-0ffd94dc9e32)" d="M1125.5,0H.5V339.9H153.2c1.8,28.7,13.5,56.4,35.1,82.4,21.6,26,52.1,49.2,90.7,68.9,76.3,38.9,176.9,60.3,283.5,60.3s207.2-21.4,283.5-60.3c38.6-19.7,69.1-42.8,90.7-68.9,21.6-26,33.4-53.7,35.1-82.4h153.7V0ZM563,71.5c140.3,0,254,77.2,254,172.5s-113.7,172.5-254,172.5-254-77.2-254-172.5,113.7-172.5,254-172.5Zm258.3,386.3c-33,16-71.7,28.6-115,37.5-45.5,9.3-93.9,14-143.8,14s-98.4-4.7-143.8-14c-43.3-8.9-82-21.5-115-37.5-59.3-28.7-93.6-65.2-97.7-103.3h85c26.8,58.1,138.4,101.8,272,101.8s245.2-43.6,272-101.8h84c-4.1,38.1-38.4,74.6-97.7,103.3Z"/></svg>`;
// const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;


// const GameHeaderContainer = styled.header`
//   display: flex;
//   position: absolute;
//   padding: 1rem;
//   height: 50vw;
//   left: -21px;
//   width: 100%;
//   justify-content: flex-end;
//   z-index: 1;
//   background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 600" style="width: 100%"><defs><filter id="uuid-364a1b21-ff76-46ea-9649-0ffd94dc9e32" filterUnits="userSpaceOnUse"><feOffset dx="0" dy="14"/><feGaussianBlur result="uuid-f8a21010-bcb6-463e-b49c-d72f877ef816" stdDeviation="0"/><feFlood flood-color="%231c1c2d" flood-opacity="1"/><feComposite in2="uuid-f8a21010-bcb6-463e-b49c-d72f877ef816" operator="in"/><feComposite in="SourceGraphic"/></filter></defs><path fill="%2340404c" filter="url(%23uuid-364a1b21-ff76-46ea-9649-0ffd94dc9e32)" d="M1125.5,0H.5V339.9H153.2c1.8,28.7,13.5,56.4,35.1,82.4,21.6,26,52.1,49.2,90.7,68.9,76.3,38.9,176.9,60.3,283.5,60.3s207.2-21.4,283.5-60.3c38.6-19.7,69.1-42.8,90.7-68.9,21.6-26,33.4-53.7,35.1-82.4h153.7V0ZM563,71.5c140.3,0,254,77.2,254,172.5s-113.7,172.5-254,172.5-254-77.2-254-172.5,113.7-172.5,254-172.5Zm258.3,386.3c-33,16-71.7,28.6-115,37.5-45.5,9.3-93.9,14-143.8,14s-98.4-4.7-143.8-14c-43.3-8.9-82-21.5-115-37.5-59.3-28.7-93.6-65.2-97.7-103.3h85c26.8,58.1,138.4,101.8,272,101.8s245.2-43.6,272-101.8h84c-4.1,38.1-38.4,74.6-97.7,103.3Z"/></svg>');
//   background-size: cover;
//   background-position: center;
// `;

// interface GameHeaderProps {
//   children?: ReactNode;
// }

// export const GameHeader: React.FC<GameHeaderProps> = ({ children }) => (
//   <GameHeaderContainer>
//     {children}
//   </GameHeaderContainer>
// );