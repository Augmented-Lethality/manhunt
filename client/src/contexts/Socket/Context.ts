// declare how our state works with our context and our reducers
import { Socket } from 'socket.io-client';
import { createContext } from 'react';

// syntax that the context state must conform to
export interface ISocketContextState {
  socket: Socket | undefined;
  uid: string,
  users: string[];
};

// initial context state, will be overwritten eventually, but need the default state
export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  uid: '',
  users: [],
};

// these actions will each have their own functions in their reducer
export type TSocketContextActions = 'update_socket' | 'update_uid' | 'update_users' | 'remove_user';

// payload represents the data that is associated with each action that is within this context
export type TSocketContextPayload = string | string[] | Socket;

// describes the shape of the actions in this context
export interface ISocketContextActions {
  type: TSocketContextActions;
  payload: TSocketContextPayload;
}

// reducer, accepts the current state and returns the new state depending on the action that is passed in and hits the switch case
// has a default case in case the actions don't match
export const SocketReducer = (state: ISocketContextState, action: ISocketContextActions) => {
  console.log(`Message Received - Action: ${action.type} - Payload: `, action.payload);

  switch(action.type) {
    case 'update_socket':
      return { ...state, socket: action.payload as Socket };
    case 'update_uid':
      return { ...state, uid: action.payload as string };
    case 'update_users':
      return { ...state, users: action.payload as string[] };
    case 'remove_user':
      return { ...state, users: state.users.filter((uid) => uid !== (action.payload as string)) };
    default:
      return { ...state };
  }
}

// describes the shape of the context props
export interface ISocketContextProps {
  SocketState: ISocketContextState;
  SocketDispatch: React.Dispatch<ISocketContextActions>;
}

// context object that creates the context using the createContext() method
// the shape is created with the ISocketContextProps created above it
// contains the default context state which will eventually be overwritten but it needs to be initialized
// also initializes the SocketDispatch method
const SocketContext = createContext<ISocketContextProps>({
  SocketState: defaultSocketContextState,
  SocketDispatch: () => {}
});

// shares data between components without having to pass props around (react feature):
export const SocketContextConsumer = SocketContext.Consumer; // consumes the context values
export const SocketContextProvider = SocketContext.Provider; // provides the context values

export default SocketContext;