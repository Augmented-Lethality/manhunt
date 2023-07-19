import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SocketContext from '../contexts/Socket/SocketContext';
import { useAuth0 } from '@auth0/auth0-react';

type ButtonProps = {
  label?: string;
  route: string;
  onClick?: () => void;
  primary?: boolean;
  className?: string;
  buttonType?: string;
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
  height: 208px;
  width: 284px;
  margin-top: 50px;
  margin-inline: auto;
  border-radius: 57px;
  border: none;
  color: white;
  padding: 20px;
  font-size: 3rem;
  font-family: lobster;
  text-shadow: -2px -2px 0 #000, 2px -1px 0 #000, -2px 2px 0 #000, 1px 1px 0 #000;
  background-size: cover;
  background-position: center;
  box-shadow: -5px 7px 10px 3px #00000059;
  background-image: url("/textures/find-game-button.png");
  font-size: ${(props) =>
    props.label === 'Host a Contract'
      ? `3rem`
      : `2.6rem`
  };
  line-spacing: ${(props) =>
    props.label === 'Host a Contract'
      ? `1rem`
      : `2.9rem`
  };
  };

  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
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
  buttonType
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledButton2 label={label} buttonType={buttonType} onClick={handleClick} route={route}>
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

// export const ButtonToFindGame: React.FC = () => {
//   return <LargeButton label='See the Contract Board' route='/findGame' />;
// };

export const ButtonToFindGame: React.FC = () => {
  const navigate = useNavigate();

  const { player } = useContext(SocketContext).SocketState;

  const handleClick = () => {
    if (player.facialDescriptions) {
      navigate('/access', { state: { info: 'join' } });
    } else {
      window.location.reload(); // refreshes page to show popup about adding Bio Data
    }
  }

  return <LargeButton label='See the Contract Board' route='' onClick={handleClick} />;
};

export const ButtonToJoinLobby: React.FC = () => {
  return <Button label='Join this game' route='/lobby' />;
};

// export const ButtonToHostGame: React.FC = () => {
//   const { CreateGame } = useContext(SocketContext);
//   return <LargeButton label='Host a Contract' route='/lobby' onClick={CreateGame} />;
// };

export const ButtonToHostGame: React.FC = () => {
  const navigate = useNavigate();
  const { player } = useContext(SocketContext).SocketState;

  const handleClick = () => {
    if (player.facialDescriptions) {
      navigate('/access', { state: { info: 'create' } });
    } else {
      window.location.reload(); // refreshes page to show popup about adding Bio Data
    }
  }

  return <LargeButton label='Host a Contract' route='' onClick={handleClick} />;
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