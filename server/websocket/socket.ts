import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';
import { User, Game } from '../database/models';

/***** TYPESCRIPT NOTES****

- public keyword allows a class property or method to be accessed outside of the class

- when there's a variable declaration and then a ":", that is declaring the type
    - for example, <public io: Server> means it is of type Server (from socket.io module)
      and can be accessed outside of the class

- payload is an optional object that sends additional information needed to update the
  state in the client side
*/

// this class is the socket server, declaring to keep everything within the same context
export class ServerSocket {
  // static property, accessed directly through the class rather than instances of the class
  public static instance: ServerSocket;

  // public property io of type server
  public io: Server;

  // dictionary object of connected users
  // key is the user id and the value is the socket id to send messages to the correct clients
  public users: { [uid: string]: string };

  // names object, stores the uid as the string
  public names: { [uid: string]: string }

  // dictionary object of connected games
  // key is the host (the user id of who created the game)
  // the object holds the game id, and uidList which is the list of connected users
  public games: { [host: string]: { gameId: string, uidList: string[], hunted: string } };

  // new locations object, key is the user id, stores the long and lat as number values
  public locations: { [gameId: string]: { [uid: string]: { longitude: number, latitude: number } } };


  // constructor automatically called when an instance of a class is created, meaning when the server starts, this socket server
  // will be created and the items within the constructor will be performed automatically
  constructor(server: HttpServer) {
    // the only server connection to socket.io is to this instance's STATIC ServerSocket
    ServerSocket.instance = this;
    // initializing the empty users object
    this.users = {};
    // initializing the empty games object
    this.games = {};

    // initializing the empty locations object
    this.locations = {};

    // initializing the empty names object
    this.names = {}

    // new instance of the server class from socket.io, has basic options from socket.io website
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: '*'
      }
    });

    // when client connects to the server, call this StartListeners method which handles user connections/disconnections
    this.io.on('connect', this.StartListeners);

    // confirms that the socket is ready for client emits
    // console.info('Socket.io is listening');
  }

  // method to handle all of the socket functions
  // takes in the socket object sent from the client
  StartListeners = (socket: Socket) => {


    // client is asking to make a socket connection to the server, also known as a handshake
    socket.on('handshake', async (user, callback: (uid: string, users: string[], games: { [host: string]: { gameId: string, uidList: string[] } },
      names: { [uid: string]: string }) => void) => {

      socket.join('users');

      // console.log("backend user:", user)
      // is this a reconnection attempt?
      const reconnected = Object.values(this.users).includes(socket.id);

      ///////////// NEW ///////////////////
      // user exists based on authId (user.sub)?

      try {

        const existingUser = await User.findOne({ where: { authId: user.sub } });

        if (existingUser) {
          // If the user exists, update the socket.id if it doesn't match the current socket.id
          if (existingUser.socketId !== socket.id) {
            existingUser.socketId = socket.id;
            await existingUser.save();
          }
        }

      } catch (err) {
        console.error(err);
      }
      ////////////////////////////////////////

      // if it was a reconnection, re-establish the connection
      if (reconnected) {
        // console.info('User reconnected.');

        const uid = this.GetUidFromSocketID(socket.id);
        const users = Object.values(this.users);

        // if the uid obtained is valid and cool, send the client the uid and users
        if (uid) {
          // console.info('Sending info for reconnect ...');
          callback(uid, users, this.games, this.names);
          return;
        }
      }

      // generate new user, using uuid module to generate a unique uid
      const uid = v4();

      // add this to the users dictionary object
      this.users[uid] = socket.id;

      // storing all of the users from the users object into an array
      const users = Object.values(this.users);
      // console.info('Sending new user info ...');
      callback(uid, users, this.games, this.names);

      // send new user to all connected users
      this.SendMessage(
        'user_connected',
        users.filter((id) => id !== socket.id),
        users
      );
    });

    // when client emits a createGame event, make the new game
    socket.on('create_game', async (user, callback: (uid: string, games: { [host: string]: { gameId: string, uidList: string[], hunted: string } }) => void) => {

      // does the game exist?
      const host = this.GetUidFromSocketID(socket.id);

      ////////// NEW ////////////////

      try {
        const existingGame = await Game.findOne({ where: { host: user.sub } });
        // console.log(existingGame)
        if (existingGame) {
          // const allGames = await Game.findAll();
          console.log('already hosting a game');
        } else {
          const gameId = v4();
          const newGame = await Game.create({ gameId: gameId, host: user.sub, status: 'lobby' });
          const updatedUser = await User.update(
            { gameId: gameId },
            { where: { authId: user.sub } }
          )
          socket.join(gameId);
          console.log(newGame, updatedUser);
        }

      } catch (err) {
        console.log(err);
      }
      /////////////////////////////////////////////////////

      if (host) {
        // now that we have the hostid, do the games have the host id?
        if (Object.keys(this.games).includes(host)) {

          // if they do, send back all of the games
          callback(host, this.games);
          return;
        }

        // game doesn't exist, make a new one:
        const gameId = v4();

        // add this to the games dictionary object
        this.games[host] = { gameId: gameId, uidList: [host], hunted: '' };
        socket.join(gameId);


        const users = Object.values(this.users);

        if (!this.locations[gameId]) {
          this.locations[gameId] = {};
        }

        this.locations[gameId][host] = { longitude: 0, latitude: 0 };

        // now send back the updated list of games
        callback(host, this.games);

        // update the list of games
        this.SendMessage('update_games', users, this.games);

        // emit the updated locations to all players in the game EXCEPT the sender
        socket.to(gameId).emit('updated_locations', this.locations[gameId]);

      }

    });

    // Adding a user to a game
    socket.on('join_game', (host, callback) => {
      const uid = this.GetUidFromSocketID(socket.id);

      if (uid) {
        if (Object.keys(this.games).includes(host)) {

          if (!this.games[host].uidList.includes(uid)) {
            this.games[host].uidList.push(uid);
            const users = Object.values(this.users);

            // update the games for everyone
            this.SendMessage('update_games', users, this.games);
          }
        }
      }
    });


    // adding/updating a location
    socket.on('add_location', (gameId, longitude, latitude, callback) => {

      // game ID exists in the locations object?
      if (Object.keys(this.locations).includes(gameId)) {

        const uid = this.GetUidFromSocketID(socket.id);

        if (uid) {
          // add the location to the user in that game
          this.locations[gameId][uid] = { longitude: longitude, latitude: latitude };

          // send back the updated locations to the specific player
          callback(uid, this.locations[gameId]);

          // Emit the updated locations to all players in the game except the sender
          socket.to(gameId).emit('updated_locations', this.locations[gameId]);
        }
      }
    });

    socket.on('nav_to_endpoint', (host, endpoint) => {

      console.log(`received redirect to ${endpoint} from ${host}`)
      if (Object.keys(this.games).includes(host)) {

        console.log('host is in games list')
        const gameId = this.games[host].gameId

        // redirects all of the users within this game
        this.io.in(gameId).emit('redirect', endpoint);
      }
    });

    socket.on('set_hunted', (host, uid) => {

      console.log(`received set hunted to ${uid} from ${host}`)
      if (Object.keys(this.games).includes(host)) {

        this.games[host].hunted = uid;
        // const gameId = this.games[host].gameId

        const users = Object.values(this.users);
        this.SendMessage('update_games', users, this.games);
      }
    });

    // adding/updating a name
    socket.on('add_name', (name, uid, callback) => {

      // uid is not in the names object?
      if (!this.names[uid]) {

        this.names[uid] = name;

        const users = Object.values(this.users);

        callback(this.names);

        this.SendMessage('update_names', users, this.names);
      }
    });


    // when the disconnect occurs
    socket.on('disconnect', () => {
      // console.info('Disconnect received from: ' + socket.id);

      // gets the user uid from the users at the specific socket id
      const uid = this.GetUidFromSocketID(socket.id);

      // if there was a valid uid returned, delete that user from the users object and send the updated array to the client
      if (uid) {
        delete this.users[uid];

        const users = Object.values(this.users);

        this.SendMessage('user_disconnected', users, socket.id);

        if (this.games[uid]) {
          delete this.games[uid];

          this.SendMessage('update_games', users, this.games);
        }
      }
    });
  };

  //// HELPER FUNCTIONS ////

  // inserting socket id of type string and finding the user within the users dictionary object
  GetUidFromSocketID = (id: string) => {
    return Object.keys(this.users).find((uid) => this.users[uid] === id);
  };

  // name is name of socket, users is list of socket ids, payload is information needed by the user for state updates
  SendMessage = (name: string, users: string[], payload?: Object) => {
    console.info('Emitting event: ' + name + ' to', users);
    users.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)));
  };

  SendGames = (name: string, users: string[], payload?: Object) => {
    console.info('Emitting event: ' + name + ' to', users, 'payload', payload);
    users.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)));
  };


}
