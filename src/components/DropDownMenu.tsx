import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { BsThreeDots } from 'react-icons/bs/';
import { IoIosCloseCircle } from 'react-icons/io/';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends } from 'react-icons/fa';
import { FiLogOut, FiSettings } from 'react-icons/fi';

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

const Dots = styled(BsThreeDots)`
height: 10vw;
width: 10vw;
border-radius: 50%;
border: 2px solid #5E5E63;
box-sizing: border-box;
`;

const Close = styled(IoIosCloseCircle)`
height: 10vw;
width: 10vw;
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
        <div onClick={()=>{navigate('/friends')}}><FaUserFriends/>friends</div>
        <div onClick={()=>{navigate('/settings')}}><FiSettings/>settings</div>
        <div onClick={()=>{logout({logoutParams: {returnTo: window.location.origin}})}}><FiLogOut/>logout</div>
      </Menu>

    </div>
  );
};

export default DropDownMenu;