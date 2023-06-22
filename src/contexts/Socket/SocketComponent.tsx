import React, { PropsWithChildren, useReducer, useState, useEffect } from 'react';
import { useSocket } from '../../custom-hooks/useSocket';
import { SocketContextProvider, SocketReducer, defaultSocketContextState } from './SocketContext'; // custom by meee
import { useAuth0 } from '@auth0/auth0-react';
import { User } from './SocketContext';

import axios from 'axios';


// THIS CAN BE REUSED TO PASS THE SOCKET INFORMATION AROUND THE CLIENT SIDE

// allows for defining the prop types expected by the SocketComponent
// PropsWithChildren allows components to accept nested elements in its children
export interface ISocketComponentProps extends PropsWithChildren { }

// functional component that has ISocketComponentProps as its children/props
const SocketComponent: React.FunctionComponent<ISocketComponentProps> = (props) => {
  // nested elements within SocketComponent, rendered in the context provider
  const { children } = props;

  const { user } = useAuth0();


  // making a local state to store the created reducer and the default socket context state
  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);

  // if loading, let's show the loading message so it doesn't break
  const [loading, setLoading] = useState(true);

  const socket = useSocket(`https://${process.env.REACT_APP_SOCKET_URI}`, {
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    autoConnect: false, // want to make sure the useEffect performs the actions in order, so put false
  });

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
      // socket.emit('user_connected', some global state variable)
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

    // updating games
    socket.on('update_games', async () => {
      try {
        const response = await axios.get('/games');
        const games = response.data;
        console.log('updating game state', games)
        SocketDispatch({ type: 'update_games', payload: games });
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    });

    // updating users
    socket.on('update_users', async () => {
      try {
        const response = await axios.get('/users/sockets');
        const users = response.data;
        console.log('updating users state:', users)
        SocketDispatch({ type: 'update_users', payload: users });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    });

    // update locations event
    socket.on('updated_locations', (locations) => {
      console.info('location created, new location list received');
      SocketDispatch({ type: 'updated_locations', payload: locations });
    });

    // update the names state
    socket.on('update_names', (names: { [authId: string]: string }) => {
      // console.info('names updated, new name list received')
      SocketDispatch({ type: 'update_names', payload: names })
    });


  }

  // sending the handshake to the server, meaning it's trying to establish a connection to the server using websocket
  const SendHandshake = () => {
    socket.emit('handshake', user, () => {
      setLoading(false);
    });

    socket.on('handshake_reply', (response) => {
      setLoading(false);
    });
  };


  // sending createRoom to the server
  const CreateGame = () => {
    socket.emit('create_game', user, () => {
      // console.log('creating game client side');
    });
  }

  const AddLocation = (gameId: string, longitude: number, latitude: number, user: any) => {
    console.info(`User ${user.sub} wants to add a location: ${longitude} ${latitude}`);

    socket.emit('add_location', gameId, longitude, latitude, user, (authId: string, locations: { [authId: string]: { longitude: number, latitude: number } }) => {
      SocketDispatch({ type: 'updated_locations', payload: locations });
    });
  };

  // sending join game to the server, host identifies game to join
  const JoinGame = (host: string, user: User) => {
    // console.info('Client wants to join a game...');

    socket.emit('join_game', host, user, () => {
      console.log('joining game')
    });

    socket.emit('join_lobby', host, user, () => {
      console.log('joining lobby')
    });
  };

  const Redirect = (host: string, endpoint: string) => {
    // console.info(`Redirect from ${host} to ${endpoint}`);
    socket.emit('nav_to_endpoint', host, endpoint);
  };

  const SetHunted = (host: string, authId: string) => {
    // console.info(`Setting Hunted, ${host} picked ${ authId }`);
    socket.emit('set_hunted', host, authId);
  };

  const AddName = (name: string, authId: string) => {
    // console.info('Adding name');
    socket.emit('add_name', name, authId, (names: { [authId: string]: string }) => {
      SocketDispatch({ type: 'update_names', payload: names });
    });
  }


  // showing this on client side while socket isn't connected
  if (loading) {
    return <p>Loading Socket Connection...</p>
  };

  // provides the socket context to the nested components
  // this will be placed around the components in index.tsx so all of the components can use this socket connection
  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch, CreateGame, AddLocation, JoinGame, Redirect, SetHunted, AddName }}>
      {children}
    </SocketContextProvider>
  )

}

export default SocketComponent;