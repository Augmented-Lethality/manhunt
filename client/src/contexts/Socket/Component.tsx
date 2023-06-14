import React, { PropsWithChildren, useReducer, useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { SocketContextProvider, SocketReducer, defaultSocketContextState } from './Context'; // custom by meee

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

  const socket = useSocket('ws://localhost:3666', {
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

    socket.io.on('reconnect', (attempt) => {
      console.info('Reconnected on attempt: ' + attempt);
    })

    socket.io.on('reconnect_attempt', (attempt) => {
      console.info('Reconnection attempt: ' + attempt);
    })

    socket.io.on('reconnect_error', (error) => {
      console.info('Reconnection error: ' + error);
    })

    socket.io.on('reconnect_failed', () => {
      console.info('Reconnection failure');
      alert('Unable to connect to web socket')
    })

  }

  const SendHandshake = () => {}

  if(loading) {
    return <p>Loading Socket IO...</p>
  };

  // provides the socket context to the nested components
  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch}}>
      {children}
    </SocketContextProvider>
  )

}

export default SocketContextComponent;