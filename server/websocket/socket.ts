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
  public users: { [authId: string]: string };

  // names object, stores the authId as the string
  public names: { [authId: string]: string }

  // dictionary object of connected games
  // key is the host (the user id of who created the game)
  // the object holds the game id, and authIdList which is the list of connected users
  public games: { [host: string]: { gameId: string, authIdList: string[], hunted: string } };

  // new locations object, key is the user id, stores the long and lat as number values
  public locations: { [gameId: string]: { [authId: string]: { longitude: number, latitude: number } } };


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
    socket.on('handshake', async (user) => {

      socket.join('users');

      if (socket.rooms.has('users')) {
        console.log('A client reconnected');
      }

      ///////////// NEW ///////////////////

      try {

        const existingUser = await User.findOne({ where: { authId: user.sub } });

        if (existingUser) {
          // If the user exists, update the socket.id
          await User.update(
            { socketId: socket.id },
            { where: { authId: user.sub } }
          )
          console.log('updated db user connection')
        }

      } catch (err) {
        console.error(err);
      }
      ////////////////////////////////////////

      // send new user to all connected users to update their state
      this.io.to('users').emit('update_users');
      this.io.to('users').emit('update_games');
      socket.emit('handshake_reply', 'success');

    });

    // when client emits a createGame event, make the new game
    socket.on('create_game', async (user) => {

      ////////// NEW ////////////////

      try {
        const hostingGame = await Game.findOne({ where: { host: user.sub } });
        if (hostingGame) {
          console.log('already hosting a game');
        } else {
          const gameId = v4();
          const hostName = user.name;
          await Game.create({ gameId: gameId, host: user.sub, hostName: hostName, status: 'lobby', users: [user.sub] });
          await User.update({ gameId: gameId }, { where: { authId: user.sub } })
          socket.join(gameId);

        }
        // send new user to all connected users to update their games lists
        this.io.to('users').emit('update_games');

      } catch (err) {
        console.log(err);
      }
      /////////////////////////////////////////////////////

    });

    socket.on('join_game', async (host, user) => {
      try {
        const game = await Game.findOne({ where: { host: host } });
        if (game) {
          await User.update({ gameId: game.gameId }, { where: { authId: user.sub } });
          await Game.update({ users: [...game.users, user.sub] }, { where: { host: host } });
          socket.join(game.gameId);

          this.io.to('users').emit('update_games');
        } else {
          console.log('no game with that host exists')
        }
      } catch (err) {
        console.log(err);
      }
    });



    // adding/updating a location
    socket.on('add_location', (gameId, longitude, latitude, user, callback) => {
      console.log(user.sub)



      // game ID exists in the locations object?
      if (Object.keys(this.locations).includes(gameId)) {

        const authId = this.GetAuthIdFromSocketID(socket.id);

        if (authId) {
          // add the location to the user in that game
          this.locations[gameId][authId] = { longitude: longitude, latitude: latitude };

          // send back the updated locations to the specific player
          callback(authId, this.locations[gameId]);

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

    socket.on('set_hunted', (host, authId) => {

      console.log(`received set hunted to ${authId} from ${host}`)
      if (Object.keys(this.games).includes(host)) {

        this.games[host].hunted = authId;
        // const gameId = this.games[host].gameId

        const users = Object.values(this.users);
        this.SendMessage('update_games', users, this.games);
      }
    });

    // adding/updating a name
    socket.on('add_name', (name, authId, callback) => {

      // authId is not in the names object?
      if (!this.names[authId]) {

        this.names[authId] = name;

        const users = Object.values(this.users);

        callback(this.names);

        this.SendMessage('update_names', users, this.names);
      }
    });


    // when the disconnect occurs
    socket.on('disconnect', async () => {

      // gets the user authId from the users at the specific socket id
      const authId = this.GetAuthIdFromSocketID(socket.id);

      /////////// NEW //////////////////
      try {
        const user = await User.findOne({ where: { socketId: socket.id } });
        if (user) {
          const game = await Game.findByPk(user.dataValues.gameId);

          // remove user from the list of users in the game since they're disconnected
          if (game) {
            const updatedUserList = game.dataValues.users.filter((authId: string) => authId !== user.dataValues.authId);
            await Game.update(
              { users: updatedUserList },
              { where: { gameId: user.dataValues.gameId } }
            )
          }

          // delete the socket id from the user since they're not connected anymore
          const updatedUser = await User.update(
            { socketId: '' },
            { where: { socketId: socket.id } }
          )
          // console.log('removed socket from user:', updatedUser)
        }

      } catch (err) {
        console.log(err);
      }
      //////////////////////////////////

      // if there was a valid authId returned, delete that user from the users object and send the updated array to the client
      if (authId) {
        delete this.users[authId];

        const users = Object.values(this.users);

        this.io.to('users').emit('user_disconnected', users, socket.id)

        if (this.games[authId]) {

          delete this.games[authId];

          this.io.to('users').emit('update_games', users, this.games);
        }
      }
    });
  };

  //// HELPER FUNCTIONS ////

  // inserting socket id of type string and finding the user within the users dictionary object
  GetAuthIdFromSocketID = (id: string) => {
    return Object.keys(this.users).find((authId) => this.users[authId] === id);
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
