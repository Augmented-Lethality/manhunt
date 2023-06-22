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

const StyledButton = styled.button<ButtonProps>`
  /* Adapt the colors based on primary prop */
  background: ${(props) => (props.primary ? '#6e6b8c' : 'white')};
  color: ${(props) => (props.primary ? 'white' : '#6e6b8c')};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #6e6b8c;
  border-radius: 3px;
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
<StyledButton label={label} primary={!primary} onClick={handleClick} route={route}>
  {label}
</StyledButton>

  );
};

export const ButtonToHome: React.FC = () => {
  return <Button label='Home' route='/home'  />;
};

export const ButtonToGame: React.FC = () => {
  return <Button label='Game Time' route='/onthehunt' />;
};

export const ButtonToProfile: React.FC = () => {
  return <Button label='Profile' route='/profile' />;
};

export const ButtonToFindGame: React.FC = () => {
  return <Button label='Find a Game' route='/findGame' />;
};

export const ButtonToJoinLobby: React.FC = () => {
  return <Button label='Join this game' route='/lobby' />;
};

export const ButtonToHostGame: React.FC = () => {
  const { CreateGame } = useContext(SocketContext);
  return <Button label='Host a Game' route='/lobby' onClick={CreateGame} />;
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
