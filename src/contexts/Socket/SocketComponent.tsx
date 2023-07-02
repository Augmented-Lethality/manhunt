import React, { PropsWithChildren, useReducer, useState, useEffect } from 'react';
import { useSocket } from '../../custom-hooks/useSocket';
import { SocketContextProvider, SocketReducer, defaultSocketContextState } from './SocketContext'; // custom by meee
import { useAuth0 } from '@auth0/auth0-react';
import { User, Ready } from './SocketContext';
import PageLoader from '../../components/Loading';
import { useNavigate } from 'react-router-dom';


// THIS CAN BE REUSED TO PASS THE SOCKET INFORMATION AROUND THE CLIENT SIDE

// allows for defining the prop types expected by the SocketComponent
// PropsWithChildren allows components to accept nested elements in its children
export interface ISocketComponentProps extends PropsWithChildren { }

// functional component that has ISocketComponentProps as its children/props
const SocketComponent: React.FunctionComponent<ISocketComponentProps> = (props) => {
  // nested elements within SocketComponent, rendered in the context provider
  const { children } = props;

  const { user } = useAuth0();

  const navigate = useNavigate();


  // making a local state to store the created reducer and the default socket context state
  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);

  // if loading, let's show the loading message so it doesn't break
  const [loading, setLoading] = useState(true);

  const socket = useSocket(`https://${process.env.REACT_APP_SOCKET_URI}`, {
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    autoConnect: false, // want to make sure the useEffect performs the actions in order, so put false
  });

  // IF NEED HTTP SOCKET CONNECTION
  // const socket = useSocket(`http://${process.env.REACT_APP_SOCKET_URI}`, {
  //   reconnectionAttempts: 5,
  //   reconnectionDelay: 3000,
  //   autoConnect: false, // want to make sure the useEffect performs the actions in order, so put false
  // });

  // when the component mounts, aka the user visits a react component surrounded by this socket component, these functions are called
  useEffect(() => {

    // opens the socket
    socket.connect();

    // updates the socket state on the connection
    SocketDispatch({ type: 'update_socket', payload: socket })

    // start the event listeners
    StartListeners();

    // send the handshake (attempts to connect to the server)
    SendHandshake();

    // eslint-disable-next-line
  }, [])

  const StartListeners = () => {
    // declare default event listeners that socket.io provides to handle reconnection events

    // reconnect
    socket.io.on('reconnect', (attempt) => {
      console.info('Reconnected on attempt: ' + attempt);
      socket.emit('reconnect_user', user, () => {
      });

    })

    // trying to reconnect
    socket.io.on('reconnect_attempt', (attempt) => {
      console.info('Reconnection attempt: ' + attempt);
    })

    // error on reconnect
    socket.io.on('reconnect_error', (error) => {
      console.info('Reconnection error: ' + error);
    })

    // reconnect failed
    socket.io.on('reconnect_failed', () => {
      console.info('Reconnection failure');
      // alert('Unable to connect to web socket')
    })

    // updating games list, user is not in game if they see this
    socket.on('update_games', async (games) => {
      console.log('updating games state:', games)
      SocketDispatch({ type: 'update_games', payload: games });
    });

    // updating users not in game
    socket.on('update_users', async (users) => {
      console.log('updating users state:', users)
      SocketDispatch({ type: 'update_users', payload: users });
    });

    // updating the ready status of the users in the game
    socket.on('update_ready', async (ready) => {
      console.log('updating ready state:', ready)
      SocketDispatch({ type: 'update_ready', payload: ready });
    });

    // updating users in game lobby
    socket.on('update_lobby_users', async (users) => {
      console.log('updating lobby users state:', users)
      SocketDispatch({ type: 'update_lobby_users', payload: users });
    });

    // updating the games in the lobby (should only be one, but different details about it change)
    socket.on('update_lobby_games', async (games) => {
      console.log('updating lobby games state:', games)
      SocketDispatch({ type: 'update_lobby_games', payload: games });

      // redirecting the user based on the lobby games state
      const redirect = () => {
        if (games[0].status === 'lobby') {
          navigate('/lobby');
        } else if (games[0].status === 'complete') {
          navigate('/gameover');
        } else if (games[0].status === 'ongoing') {
          navigate('/onthehunt');
        } else if (games[0].users.length <= 0) {
          navigate('/home');
          LeaveGame(user);
        }
      }

      if (games.length > 0) {
        redirect();
      }
    });

    // update locations event
    socket.on('update_locations', async (locations) => {
      // making sure the locations are not strings, but rather numbers with decimals
      const correctLocations = locations.map(location => ({
        ...location,
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude)
      }));
      console.log('updating locations state:', correctLocations)
      SocketDispatch({ type: 'update_locations', payload: correctLocations });
    });

    // redirects the user to a certain endpoint
    socket.on('redirect', async (endpoint) => {
      console.log('redirecting user to', endpoint)
      navigate(endpoint);
    });
  }

  // sending the handshake to the server, meaning it's trying to establish a connection to the server using websocket
  const SendHandshake = () => {
    socket.emit('handshake', user, () => {
      setLoading(false);
    });

    socket.on('handshake_reply', (response) => {

      // sending the player information back if success, if failure it sends a string
      if (typeof response !== 'string') {
        SocketDispatch({ type: 'update_player', payload: response });
        setLoading(false);
      } else {
        console.error('Could not create a connection between client and server! Help!')
      }
    });
  };

  // sending createRoom to the server
  const CreateGame = () => {
    socket.emit('create_game', user, () => {
    });
  }

  const AddLocation = (user: any, gameId: string, longitude: number, latitude: number) => {
    socket.emit('add_location', user, gameId, longitude, latitude, () => {
    });
  };

  // sending join game to the server
  const JoinGame = (host: string, user: User) => {
    // console.info('Client wants to join a game...');

    socket.emit('join_game', host, user, () => {
    });

    socket.emit('join_lobby', host, user, () => {
    });
  };

  // sending leave game to the server
  const LeaveGame = (user: any) => {
    socket.emit('leave_game', user, () => {
    });
  };

  const Redirect = (endpoint: string) => {
    socket.emit('nav_to_endpoint', endpoint);
  };

  const SetHunted = (victim: User) => {
    socket.emit('set_hunted', victim);
  };

  const UpdateGameStatus = (user: User, status: string) => {
    socket.emit('update_game_status', user, status);
  };

  const AddGameStats = (user: any) => {
    socket.emit('game_stats', user);
  }

  const UpdateReady = (ready: Ready) => {
    socket.emit('update_ready_state', ready);
  }

  const AddGameDuration = (time: number, user: any) => {
    socket.emit('update_game_timer', time, user);
  };

  const AddGameStart = (time: number, user: any) => {
    socket.emit('update_game_start', time, user);
  };

  // showing this on client side while socket isn't connected
  if (loading) {
    return <PageLoader />
  };

  // provides the socket context to the nested components
  // this will be placed around the components in index.tsx so all of the components can use this socket connection
  return (
    <SocketContextProvider value={{
      SocketState, SocketDispatch, CreateGame, AddLocation, JoinGame, Redirect, SetHunted, LeaveGame, UpdateGameStatus,
      AddGameStats, UpdateReady, AddGameDuration, AddGameStart,
    }}>
      {children}
    </SocketContextProvider>
  )

}

export default SocketComponent;