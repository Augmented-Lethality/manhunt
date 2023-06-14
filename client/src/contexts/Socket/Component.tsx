import React, { PropsWithChildren, useReducer, useState } from 'react';
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