import { useRef, useEffect } from 'react';
import io, { ManagerOptions, SocketOptions, Socket } from 'socket.io-client';

// THIS IS SETTING UP THE SOCKET.IO CONNECTION ON THE CLIENT SIDE AND CREATING A CUSTOM HOOK SO IT CAN BE REUSED

// creating a custom hook for socket, options was determined by hovering over SocketOptions
export const useSocket = (uri: string, opts?: Partial<ManagerOptions & SocketOptions> | undefined):
// of type socket
Socket => {
  // useRef to store a mutable value that does not cause a re-render when updated
  const { current: socket } = useRef(io(uri, opts));

  // if component is updated, check that socket still exists. if it doesn't, then close the connection
  useEffect(() => {
    return () => {
      if(socket) {
        socket.close(); // closes the connection using close method from socket module
      }
    }
  }, [socket])
  return socket;
}

