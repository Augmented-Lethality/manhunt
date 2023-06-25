import React, { ReactNode } from 'react';
import styled from 'styled-components';
import DropDownMenu from '../components/DropDownMenu';
import { useNavigate } from 'react-router-dom';
import { BsPersonSquare } from 'react-icons/bs';
import { AiFillHome } from 'react-icons/ai';
import { IoHome } from 'react-icons/io5';
import { useAuth0 } from '@auth0/auth0-react';

export const StyledHeader = styled.header`
  display: flex;
  padding: 1rem;
  height: 100px;
  background-color: #3F404F;
  border-bottom: 1px solid #202026;
  justify-content: space-between;
  align-items: end;
  z-index: 1;
`;

export function HomeHeader({ users }) {
  const navigate = useNavigate();
  const { user } = useAuth0();
  return (
    <StyledHeader>
      <h1 className='logo'>Man Hunt</h1>
      <p>Users Online: {users.length}</p>
      <img
        src={user?.picture}
        alt='Profile'
        className='profile__avatar'
        onClick={()=>{navigate('/profile')}}
        style={{ height: '10vw', width: '10vw', borderRadius:'50%' }}/>
        <DropDownMenu>
          <div onClick={()=>{navigate('/profile')}}><BsPersonSquare/>profile</div>
        </DropDownMenu>
    </StyledHeader>
  );
}

export function Header({ page }) {
  const navigate = useNavigate();
  const { user } = useAuth0();
  return (
    <StyledHeader>
      <IoHome className='react-icon-logo' onClick={() => navigate('/home')}/>
      <h1>{page}</h1>
      <img
        src={user?.picture}
        alt='Profile'
        className='profile__avatar'
        onClick={()=>{navigate('/profile')}}
        style={{ height: '10vw', width: '10vw', borderRadius:'50%' }}/>
        <DropDownMenu>
          <div onClick={()=>{navigate('/home')}}><AiFillHome/>home</div>
        </DropDownMenu>
    </StyledHeader>
  );
}


export const Footer = styled.footer`
  display: flex;
  padding: 1rem;
  background-color: #2a2a32;
  border-top: 1px solid #202026;
  justify-content: space-between;
  align-items: end;
  z-index: 1;
  position: relative;
`;

const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 600"><defs><filter id="uuid-364a1b21-ff76-46ea-9649-0ffd94dc9e32" filterUnits="userSpaceOnUse"><feOffset dx="0" dy="14"/><feGaussianBlur result="uuid-f8a21010-bcb6-463e-b49c-d72f877ef816" stdDeviation="0"/><feFlood flood-color="#1c1c2d" flood-opacity="1"/><feComposite in2="uuid-f8a21010-bcb6-463e-b49c-d72f877ef816" operator="in"/><feComposite in="SourceGraphic"/></filter></defs><path fill="#40404c" filter="url(#uuid-364a1b21-ff76-46ea-9649-0ffd94dc9e32)" d="M1125.5,0H.5V339.9H153.2c1.8,28.7,13.5,56.4,35.1,82.4,21.6,26,52.1,49.2,90.7,68.9,76.3,38.9,176.9,60.3,283.5,60.3s207.2-21.4,283.5-60.3c38.6-19.7,69.1-42.8,90.7-68.9,21.6-26,33.4-53.7,35.1-82.4h153.7V0ZM563,71.5c140.3,0,254,77.2,254,172.5s-113.7,172.5-254,172.5-254-77.2-254-172.5,113.7-172.5,254-172.5Zm258.3,386.3c-33,16-71.7,28.6-115,37.5-45.5,9.3-93.9,14-143.8,14s-98.4-4.7-143.8-14c-43.3-8.9-82-21.5-115-37.5-59.3-28.7-93.6-65.2-97.7-103.3h85c26.8,58.1,138.4,101.8,272,101.8s245.2-43.6,272-101.8h84c-4.1,38.1-38.4,74.6-97.7,103.3Z"/></svg>`;
const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;


const GameHeaderContainer = styled.header`
  display: flex;
  position: relative;
  top: 0;
  padding: 1rem;
  height: 95vw;
  left: -21px;
  width: 100%;
  border-bottom: 1px solid #202026;
  justify-content: flex-end;
  z-index: 1;
  background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 600" style="width: 100%"><defs><filter id="uuid-364a1b21-ff76-46ea-9649-0ffd94dc9e32" filterUnits="userSpaceOnUse"><feOffset dx="0" dy="14"/><feGaussianBlur result="uuid-f8a21010-bcb6-463e-b49c-d72f877ef816" stdDeviation="0"/><feFlood flood-color="%231c1c2d" flood-opacity="1"/><feComposite in2="uuid-f8a21010-bcb6-463e-b49c-d72f877ef816" operator="in"/><feComposite in="SourceGraphic"/></filter></defs><path fill="%2340404c" filter="url(%23uuid-364a1b21-ff76-46ea-9649-0ffd94dc9e32)" d="M1125.5,0H.5V339.9H153.2c1.8,28.7,13.5,56.4,35.1,82.4,21.6,26,52.1,49.2,90.7,68.9,76.3,38.9,176.9,60.3,283.5,60.3s207.2-21.4,283.5-60.3c38.6-19.7,69.1-42.8,90.7-68.9,21.6-26,33.4-53.7,35.1-82.4h153.7V0ZM563,71.5c140.3,0,254,77.2,254,172.5s-113.7,172.5-254,172.5-254-77.2-254-172.5,113.7-172.5,254-172.5Zm258.3,386.3c-33,16-71.7,28.6-115,37.5-45.5,9.3-93.9,14-143.8,14s-98.4-4.7-143.8-14c-43.3-8.9-82-21.5-115-37.5-59.3-28.7-93.6-65.2-97.7-103.3h85c26.8,58.1,138.4,101.8,272,101.8s245.2-43.6,272-101.8h84c-4.1,38.1-38.4,74.6-97.7,103.3Z"/></svg>');
  background-size: cover;
  background-position: center;
`;

interface GameHeaderProps {
  children?: ReactNode;
}

const TransparentOval = styled.div`
  top: 5vw;
  left: 51vw;
  position: absolute;
  width: 50%;
  height: 35vw;
  z-index: -2;
  transform: translateX(-50%);
  border-radius: 50%;
  background-color: #d7951dcc;
`;

export const GameHeader: React.FC<GameHeaderProps> = ({ children }) => (
  <GameHeaderContainer>
    <TransparentOval className='timer-background'/>
    {children}
  </GameHeaderContainer>
);