import React, { FC, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  Home,
  User,
  Users,
  MoreHorizontal,
  XCircle,
  LogOut,
  Settings,
  Award } from 'react-feather';



const dropdownAnimation = keyframes`
  0% { opacity: 0; transform: translateY(-10vh); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Backdrop = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1;
`;


const Menu = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${dropdownAnimation} 0.4s ease-in-out;
  position: absolute;
  position: absolute;
  padding-top: 1rem;
  top: 10px;
  right: 5vw;
  width: 90vw;
  z-index: 2;
  & > * {
    display: flex;
    align-items: end;
    margin: 1.5rem;
    color: white;
  }
  & > * > * {
    margin-right: 10px;
    color: cyan;
  }
`;

const Dots = styled(MoreHorizontal)`
height: 3rem;
width: 3rem;
border-radius: 50%;
border: 3px solid #6f5858;
box-sizing: border-box;
`;

const Close = styled(XCircle)`
height: 3rem;
width: 3rem;
padding: 0;
z-index: 3;
position: absolute;
top: 0;
right: 0;
`;

interface DropDownMenuProps {
  page: string;
}

const DropDownMenu: FC<DropDownMenuProps> = ({ page }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const icons = {
    home: <Home />,
    profile: <User />,
    friends: <Users />,
    trophies: <Award />,
    settings: <Settings />
  }
  const pages = Object.keys(icons);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <div className='dropdown'>
      <Dots style={{color:'#6f5858'}} onClick={toggleMenu} />
      <Backdrop isOpen={isMenuOpen} onClick={toggleMenu}/>
      <Menu className='glassmorphism drop-down-menu' isOpen={isMenuOpen}>
        <Close onClick={toggleMenu} />
        {pages.map((pageName, index) => {
          if(page.toLowerCase() !== pageName) {
            const PageComponent = icons[pageName]
            return <p key={index} onClick={()=>{navigate(`/${pageName}`)}}>
              {PageComponent}
              {pageName}
            </p>
          } 
        })}
        <p onClick={()=>{logout({logoutParams: {returnTo: window.location.origin}})}}>
          <LogOut/>
          logout
        </p>
      </Menu>
    </div>
  );
};

export default DropDownMenu;