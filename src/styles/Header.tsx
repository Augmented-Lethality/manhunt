import React, { ReactNode, useContext } from 'react';
import styled from 'styled-components';
import DropDownMenu from './DropDownMenu';
import { useNavigate } from 'react-router-dom';
import SocketContext from '../contexts/Socket/SocketContext';
import { useAuth0 } from '@auth0/auth0-react';

export const StyledHeader = styled.header`
  display: flex;
  height: 140px;
  position: fixed;
  top: 0;
  width: 100%;
  background-image: url("https://d3d9qwhf4u1hj.cloudfront.net/images/header-small.jpg");
  background-color: #db840b;
  background-size: cover;
  background-position: left bottom;
  box-sizing: border-box;
  border-bottom: solid black;
  z-index: 1;
`;

const LogoContainer = styled.div `
  height: 83%;
  width: 53vw;
  position: relative;
  bottom: -10px;
  left: -5vw;
`;

const TitleAndMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 72%;
  width: 90%;
  margin-right: 8vw;
  margin-top: 15px;
  align-items: end;
`;

interface HeaderProps {
  page?: string;
  users?: Array<Object> | null;
}

// PLEASE KEEP THIS SOCKET FUNCTION WHEN USING A GOING HOME BUTTON
export const Header: React.FC<HeaderProps> = ({ page, users }) => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { LeaveGame } = useContext(SocketContext);

  const handleHome = () => {
    LeaveGame(user);
    navigate('/home');
  }

  return (
    <StyledHeader>
      <LogoContainer onClick={handleHome}></LogoContainer>
      <TitleAndMenuContainer>
        <DropDownMenu page={page || ''} />
        {(page === 'Find')
          ? <h3>{users?.length} Hunter{users?.length !== 1 ? 's' : ''} Available for Contract</h3>
          : <h1 style={{ marginRight: '-15px' }}>{page}</h1>
        }
      </TitleAndMenuContainer>
    </StyledHeader>
  );
}

const GameStyledHeader = styled.header`
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