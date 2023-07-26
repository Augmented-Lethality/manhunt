import React, { ReactNode } from 'react';import styled from 'styled-components';
import DropDownMenu from './DropDownMenu';
import { useNavigate } from 'react-router-dom';

export const StyledHeader = styled.header`
  display: flex;
  padding: 2rem;
  padding-top: 1rem;
  height: 175px;
  justify-content: space-between;
  position: fixed;
  top: 0;
  width: 100%;
  background-image: url("https://d3d9qwhf4u1hj.cloudfront.net/images/header-small.jpg");
  background-color: #db840b;
  background-size: cover;
  background-position: left bottom;
  box-sizing: border-box;
  align-items: center;
  border-bottom: solid black;
  z-index: 1;
`;

const LogoContainer = styled.div `
  height: 100%;
  width: 23vw;
  position: relative;
  bottom: 2vw;
  left: -5vw;
`;

const TitleAndMenuContainer = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  text-align: end;
`;

interface HeaderProps {
  page?: string;
  users?: Array<Object> | null;
}

// PLEASE KEEP THIS SOCKET FUNCTION WHEN USING A GOING HOME BUTTON
export const Header: React.FC<HeaderProps> = ({ page, users }) => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/home');
  }

  return (
    <StyledHeader>
      <LogoContainer onClick={handleHome}></LogoContainer>
      <TitleAndMenuContainer>
        <DropDownMenu page={page || ''} />
        {(page === 'Find')
          ? <h3>{users?.length} Hunter{users?.length !== 1 ? 's' : ''} Available for Contract</h3>
          : page==='Game Over'
          ? <h1 style={{ fontSize: '2rem', marginRight: '-20px' }}>{page}</h1>
          : <h1 style={{ marginRight: '-20px' }}>{page}</h1>
        }
      </TitleAndMenuContainer>
    </StyledHeader>
  );
}

export const GameStyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  justify-content: space-between;
  position: absolute;
  top: 0;
  border-radius: 0px 0px 45px 45px !important;
  z-index: 1;
  text-align: center;
  width: 100vw;
  height: 160px;
`;

interface GameHeaderProps {
  children?: ReactNode;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ children }) => {
  return (
    <GameStyledHeader className='glassmorphism-dark'>
      {children}
    </GameStyledHeader>
  );
}