import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SocketContext from '../contexts/Socket/SocketContext';
import { useAuth0 } from '@auth0/auth0-react';


type ButtonProps = {
  label: string;
  route: string;
  onClick?: () => void;
  primary?: boolean;
  className?: string;
}

const StyledButton1 = styled.button<ButtonProps>`
  /* Adapt the colors based on primary prop */
  background: ${(props) => (props.primary ? '#6e6b8c' : 'white')};
  color: ${(props) => (props.primary ? 'white' : '#6e6b8c')};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #6e6b8c;
  border-radius: 3px;
`;

const StyledButton2 = styled.button<ButtonProps>`
  /* Adapt the colors based on primary prop */
  background: ${(props) => (props.primary ? '#6e6b8c' : 'white')};
  color: ${(props) => (props.primary ? 'white' : '#6e6b8c')};

  color: #292932;
  background: #d7a13c;
  font-family: Source Code Pro;
  font-size: 1em;
  font-weight: 1000;
  margin: 4em;
  padding: 2.25em;
  border: 2px solid #e5bd75;
  border-radius: 35px;
  box-shadow: 0 0 0 2.5px #1a1a20, 0 0.625em 0 0 #0f0f16cf;
`;


export const Button: React.FC<ButtonProps> = ({
  label,
  route,
  onClick,
  primary,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledButton1 label={label} primary={!primary} onClick={handleClick} route={route}>
      {label}
    </StyledButton1>

  );
};

export const LargeButton: React.FC<ButtonProps> = ({
  label,
  route,
  onClick,
  primary,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledButton2 label={label} primary={!primary} onClick={handleClick} route={route}>
      {label}
    </StyledButton2>

  );
};

export const ButtonToHome: React.FC = () => {
  return <Button label='Home' route='/home' />;
};

export const ButtonToGame: React.FC = () => {
  const { user } = useAuth0();
  const { UpdateGameStatus, AddGameStart } = useContext(SocketContext);

  const handleToGame = () => {
    UpdateGameStatus(user, 'ongoing');
    AddGameStart(Date.now(), user);
  }

  return <Button label='Game Time' route='' onClick={handleToGame} />;
};

export const ButtonToProfile: React.FC = () => {
  return <Button label='Profile' route='/profile' />;
};

export const ButtonToFindGame: React.FC = () => {
  return <LargeButton label='View The Contract Board' route='/findGame' />;
};

export const ButtonToJoinLobby: React.FC = () => {
  return <Button label='Join this game' route='/lobby' />;
};

export const ButtonToHostGame: React.FC = () => {
  const { CreateGame } = useContext(SocketContext);
  return <LargeButton label='Host a Contract with Corpoverse' route='/lobby' onClick={CreateGame} />;
};

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };
  return (
    <Button
      label='Logout'
      route='/'
      onClick={handleLogout}
      className='button__logout'
    />
  );
};


export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/home",
      },
    });
  };
  return (
    <Button
      label='Login'
      route='/'
      onClick={handleLogin}
      className='button__login'
    />
  );
};

export const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();
  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/home",
      },
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };
  return (
    <Button
      label='Signup'
      route='/home'
      onClick={handleSignUp}
      className='button__logibutton__sign-up'
    />
  );
};

export const LeaveLobbyButton = () => {
  const handleLeave = () => {
    // add a socket function to emit "leave game"
  };
  return (
    <Button
      label='Leave'
      route='/home'
      onClick={handleLeave}
      className='button__logout'
    />
  );
};