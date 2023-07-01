import React, { FC, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import MoreHorizontal from 'react-feather/dist/icons/more-horizontal';
import XCircle from 'react-feather/dist/icons/x-circle';
import Users from 'react-feather/dist/icons/users';
import LogOut from 'react-feather/dist/icons/log-out';
import Settings from 'react-feather/dist/icons/settings';


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
  background: #242429;
  border-bottom: 1px solid #070707;
  padding-top: 1rem;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 2;
  & > * {
    display: flex;
    align-items: end;
    margin: 1.5rem;
  }
  & > * > * {
    margin-right: 10px;
  }
`;

const Dots = styled(MoreHorizontal)`
height: 3rem;
width: 3rem;
border-radius: 50%;
border: 3px solid #6e6b8c;
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
  children: React.ReactNode;
}

const DropDownMenu: FC<DropDownMenuProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth0();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <div className='dropdown'>
      <Dots onClick={toggleMenu} />
      <Backdrop isOpen={isMenuOpen} onClick={toggleMenu}/>
      <Menu isOpen={isMenuOpen}>
        <Close onClick={toggleMenu} />
        {children}
        <p onClick={()=>{navigate('/yourcompetition')}}><Users/>friends</p>
        <p onClick={()=>{navigate('/settings')}}><Settings/>settings</p>
        <p onClick={()=>{logout({logoutParams: {returnTo: window.location.origin}})}}><LogOut/>logout</p>
      </Menu>

    </div>
  );
};

export default DropDownMenu;