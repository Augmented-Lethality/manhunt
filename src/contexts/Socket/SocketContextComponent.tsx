import React, { PropsWithChildren, useReducer, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSocket } from '../../custom-hooks/useSocket';
import { SocketContextProvider, SocketReducer, defaultSocketContextState } from './SocketContext'; // custom by meee

// THIS CAN BE REUSED TO PASS THE SOCKET INFORMATION AROUND THE CLIENT SIDE

// allows for defining the prop types expected by the SocketContextComponent
// PropsWithChildren allows components to accept nested elements in its children
export interface ISocketContextComponentProps extends PropsWithChildren {}

// functional component that has ISocketContextComponentProps as its children/props
const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {

  // nested elements within SocketContextComponent, rendered in the context provider
  const { children } = props;

  // making a local state to store the created reducer and the default socket context state
  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);

  // if loading, let's show the loading message so it doesn't break
  const [loading, setLoading] = useState(true);

  const socket = useSocket(`ws://${ process.env.REACT_APP_SOCKET_URI }`, {
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    autoConnect: false, // want to make sure the useEffect performs the actions in order, so put false
  });

  useEffect(() => {
    // connect to Web Socket
    socket.connect();

    // save the socket in context
    SocketDispatch({ type: 'update_socket', payload: socket })

    // start the event listeners
    StartListeners();

    // send the handshake
    SendHandshake();

    // eslint-disable-next-line
  }, [])

  const StartListeners = () => {
    // declare default event listeners that socket.io provides to handle reconnection events

    // reconnect
    socket.io.on('reconnect', (attempt) => {
      console.info('Reconnected on attempt: ' + attempt);
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
      alert('Unable to connect to web socket')
    })

    // user connected event
    socket.on('user_connected', (users: string[]) => {
      console.info('user connected, new user list received')
      SocketDispatch({ type: 'update_users', payload: users })
    });

    // user disconnected event
    socket.on('user_disconnected', (uid: string) => {
      console.info('user disconnected')
      SocketDispatch({ type: 'remove_user', payload: uid })
    });

    // created a game event
    socket.on('game_created', (games: { [host: string]: { gameId: string, uidList: string[], hunted: string }}) => {
      console.info('game created, new game list received')
      SocketDispatch({ type: 'update_games', payload: games })
    });

    // updated a game event
    socket.on('update_games', (games: { [host: string]: { gameId: string, uidList: string[], hunted: string }}) => {
      console.info('games updated, new game list received')
      SocketDispatch({ type: 'update_games', payload: games })
    });

    // update locations event
    socket.on('updated_locations', (locations) => {
      console.info('location created, new location list received');
      SocketDispatch({ type: 'updated_locations', payload: locations });
    });

    // redirect users event
    socket.on('redirect', (endpoint) => {
      console.info(`redirecting to ${ endpoint }`);
      const navigate = useNavigate();
      navigate(endpoint);
    });


  }

  // sending the handshake to the server, meaning it's trying to establish a connection to the server using websocket
  const SendHandshake = () => {
    console.info('Client wants a handshake...');

    // the cb on the same message so don't have to create a handshake_reply emit for connection, it'll just happen when they connect
    // on the handshake and it gets the cb from the server on handshake
    socket.emit('handshake', (uid: string, users: string[], games: { [host: string]: { gameId: string, uidList: string[], hunted: string }}) => {
      console.log('We shook, let\'s trade info xoxo');
      SocketDispatch({ type: 'update_uid', payload: uid });
      SocketDispatch({ type: 'update_users', payload: users });
      SocketDispatch({ type: 'update_games', payload: games });

      // not loading anymore since it connected
      setLoading(false);
    });
  }

    // sending createRoom to the server
    const CreateGame = () => {
      console.info('Client wants to create a game...');

      socket.emit('create_game', (uid: string, games: { [host: string]: { gameId: string, uidList: string[], hunted: string }}) => {
        SocketDispatch({ type: 'update_games', payload: games })
      });
    }

    const AddLocation = (gameId: string, longitude: number, latitude: number) => {
      console.info(`Someone from game ${gameId} wants to add a location...`);

      socket.emit('add_location', gameId, longitude, latitude, (uid: string, locations: { [uid: string]: { longitude: number, latitude: number } }) => {
        SocketDispatch({ type: 'updated_locations', payload: locations });
      });
    };

      // sending join game to the server, host identifies game to join
      const JoinGame = (host: string) => {
        console.info('Client wants to join a game...');

        socket.emit('join_game', host, (uid: string, games: { [host: string]: { gameId: string, uidList: string[], hunted: string }}) => {
          SocketDispatch({ type: 'update_games', payload: games });
        });
      };

      const Redirect = (host: string, endpoint: string) => {
        console.info(`Redirect from ${host} to ${endpoint}`);
        socket.emit('nav_to_endpoint', host, endpoint);
      };

      const SetHunted = (host: string, uid: string) => {
        console.info(`Setting Hunted, ${host} picked ${ uid }`);
        socket.emit('set_hunted', host, uid);
      };


  // showing this on client side while socket isn't connected
  if(loading) {
    return <p>Loading Socket Connection...</p>
  };

  // provides the socket context to the nested components
  // this will be placed around the components in index.tsx so all of the components can use this socket connection
  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch, CreateGame, AddLocation, JoinGame, Redirect, SetHunted }}>
      {children}
    </SocketContextProvider>
  )

}

export default SocketContextComponent;