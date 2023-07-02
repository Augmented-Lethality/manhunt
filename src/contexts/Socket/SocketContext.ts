// THIS CONTEXT DECLARES HOW OUR STATE IN SOCKET COMPONENT WORKS (TYPESCRIPT INCLUDED)

import { Socket } from 'socket.io-client';
import { createContext } from 'react';

export interface Game {
  timeStart: number;
  hunted: string;
  createdAt: string;
  gameId: string;
  host: string;
  hostName: string;
  status: string;
  timeConstraints: number;
  updatedAt: string;
  users: string[];
  winnerId: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  authId: string;
  image: string;
  facialDescriptions: number[];
  socketId: string;
  gameId: string;
  tfModelPath: string | null;
  gamesPlayed: number;
  gamesWon: number;
  killsConfirmed: number;
  largeFont: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: number;
  username: string;
  email: string;
  authId: string;
  image: string;
  facialDescriptions: number[] | null;
  socketId: string;
  gameId: string;
  tfModelPath: string | null;
  gamesPlayed: number;
  gamesWon: number;
  killsConfirmed: number;
  largeFont: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Locations {
  authId: string;
  gameId: string;
  longitude: number;
  latitude: number;
}

export interface Ready {
  [authId: string]: string[];
}

// syntax that the context state must conform to, gives properties and types of those properties
// server will be passing this information back and forth with client as needed
export interface ISocketContextState {
  socket: Socket | undefined;
  authId: string,
  users: User[],
  games: Game[],
  locations: Locations[],
  ready: Ready,
  player: Player,
};

// initial context state, will be overwritten eventually, but need the default state
export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  authId: '',
  users: [],
  games: [],
  locations: [],
  ready: {},
  player: {
    id: 0,
    username: '',
    email: '',
    authId: '',
    image: '',
    facialDescriptions: null,
    socketId: '',
    gameId: '',
    tfModelPath: null,
    gamesPlayed: 0,
    gamesWon: 0,
    killsConfirmed: 0,
    largeFont: false,
    createdAt: '',
    updatedAt: ''
  },
};

// these actions will each have their own functions in the reducer
export type TSocketContextActions = 'update_socket' | 'update_users' | 'remove_user' | 'update_games' |
  'update_locations' | 'update_lobby_users' | 'update_lobby_games' | 'update_ready' | 'update_player'

// payload represents the data that is associated with each action that is within this context
export type TSocketContextPayload = Socket | User[] | Game[] | string | Locations[] | Ready | Player

// describes the shape of the actions in this context
export type ISocketContextActions = {
  type: TSocketContextActions;
  payload: TSocketContextPayload;
}

// reducer, accepts the current state and returns the new state depending on the action that is passed in and hits the switch case
// has a default case in case the actions don't match
export const SocketReducer = (state: ISocketContextState, action: ISocketContextActions) => {

  switch (action.type) {
    case 'update_socket':
      return { ...state, socket: action.payload as Socket };
    case 'update_player':
      return { ...state, player: action.payload as Player };
    case 'update_users':
      return { ...state, users: action.payload as User[] };
    case 'update_games':
      return { ...state, games: action.payload as Game[] };
    case 'update_locations':
      return { ...state, locations: action.payload as Locations[] };
    case 'update_lobby_users':
      return { ...state, users: action.payload as User[] };
    case 'update_lobby_games':
      return { ...state, games: action.payload as Game[] };
    case 'update_ready':
      return { ...state, ready: { ...state.ready, ...action.payload as Ready } };

    default:
      return { ...state };
  }
}

// describes the shape of the context props
export interface ISocketContextProps {
  SocketState: ISocketContextState;
  SocketDispatch: React.Dispatch<ISocketContextActions>;
  CreateGame: () => void;
  AddLocation: (user: any, gameId: string, longitude: number, latitude: number) => void;
  JoinGame: (host: string, user: User) => void;
  Redirect: (endpoint: string) => void;
  SetHunted: (victim: User) => void;
  LeaveGame: (user: any) => void;
  UpdateGameStatus: (user: any, status: string) => void;
  AddGameStats: (user: any) => void;
  UpdateReady: (ready: Ready) => void;
  AddGameDuration: (time: number, user: any) => void;
  AddGameStart: (time: number, user: any) => void;
}

// context object that creates the context using the createContext() method
// the shape is created with the ISocketContextProps created above it
// contains the default context state which will eventually be overwritten but it needs to be initialized
// also initializes the SocketDispatch method
const SocketContext = createContext<ISocketContextProps>({
  SocketState: defaultSocketContextState,
  SocketDispatch: () => { },
  CreateGame: () => { },
  AddLocation: () => { },
  JoinGame: () => { },
  Redirect: () => { },
  SetHunted: () => { },
  LeaveGame: () => { },
  UpdateGameStatus: () => { },
  AddGameStats: () => { },
  UpdateReady: () => { },
  AddGameDuration: () => { },
  AddGameStart: () => { },
});

// shares data between components without having to pass props around (react feature):
export const SocketContextConsumer = SocketContext.Consumer; // consumes the context values
export const SocketContextProvider = SocketContext.Provider; // provides the context values

export default SocketContext;