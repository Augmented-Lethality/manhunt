import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { BsThreeDots } from 'react-icons/bs/';
import { IoIosCloseCircle } from 'react-icons/io/';

const dropdownAnimation = keyframes`
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
`;


const Menu = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${dropdownAnimation} 0.5s ease-in-out;
  position: absolute;
  background: #2a2a32;
  border: 1px solid #202026;
  padding: 1rem;
  right: 0;
  top: 8.5vh;
  & > * {
    display: flex;
    align-items: center;
  }
  & > * > * {
    margin-right: 10px;
  }
`;

interface DropDownMenuProps {
  children: React.ReactNode;
}


const DropDownMenu: FC<DropDownMenuProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const Dots = styled(BsThreeDots)`
  height: 10vw;
  width: 10vw;
  margin-left: 10px;
  border-radius: 50%;
  border: 2px solid #5E5E63;
  padding: 3px;
  box-sizing: border-box;
`;

const Close = styled(IoIosCloseCircle)`
height: 10vw;
width: 10vw;
margin-left: 10px;
border-radius: 50%;
border: 2px solid #5E5E63;
padding: 0;
box-sizing: border-box;
`;
  return (
    <>
      {!isMenuOpen ?
      <Dots onClick={toggleMenu} />
      : <Close onClick={toggleMenu} />
      }
      <Menu isOpen={isMenuOpen}>
        {children}
      </Menu>
    </>
  );
};

export default DropDownMenu;