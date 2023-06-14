import { Server as HTTPServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

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

  // Master list of all connected users, dictionary object
  // key is the user id and the value is the socket id to send messages to the correct clients
  public users: { [uuid: string]: string}

  // constructor automatically called when an instance of a class is created, meaning when the server starts, this socket server
  // will be created and the items within the constructor will be performed automatically
  constructor(server: HTTPServer) {

    // the only server connection to socket.io is to this instance's STATIC ServerSocket
    ServerSocket.instance = this;

    // initializing the empty users object
    this.users = {};

    // new instance of the server class from socket.io, has basic options from socket.io website
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: '*'   // NOT SAFE NEED TO CHANGE
      }
    });

    // when client connects to the server, call this StartListeners method which handles user connections/disconnections
    this.io.on('connect', this.StartListeners);

    // confirms that the socket is ready for client emits
    console.info('Socket.io is listening');
  }

  // method to handle all of the socket functions
  // takes in the current socket of type Socket, which is from the socket.io module
  StartListeners = (socket: Socket) => {

    // client send a message to the server, this is generic on every listener
    console.info('Message received from ' + socket.id);

    // client is attempting to connect to the server, also known as a handshake
    socket.on('handshake', (callback:(uid: string, users:string[]) => void) => {

      // handshake has been received from the client with the specific socket id
      console.info('handshake received from ' + socket.id);

      // is this a reconnection attempt?
      const reconnected = Object.values(this.users).includes(socket.id);

      // if it was a reconnection, re-establish the connection
      if(reconnected) {
        console.info('User successfully reconnected');
        const uid = this.GetUidFromSocketId(socket.id);
        const users = Object.values(this.users);

        // if the uid obtained is valid and cool, send the client the uid and users
        if(uid) {
          console.info('Sending info for client reconnect...');
          callback(uid, users);
          return;
        }
      }

      // generate new user, using uuid module to generate a unique uid
      const uid = v4();
      // add this to the users dictionary object
      this.users[uid] = socket.id;

      // storing all of the users from the users object into an array
      const users = Object.values(this.users);

      console.info('Sending info for handshake...');
      callback(uid, users);

      // send new user to all connected users
      this.SendMessage(
        'user_connected', // type of message being sent
        users.filter((id) => id !== socket.id), // making sure not to send the newly connected user to the newly connected user
        users // sending all of the users, including the new user, in an array
      );
    });

    // when the disconnect occurs
    socket.on('disconnect', () => {
      console.info('Disconnect received from ' + socket.id)

      // gets the user uid from the users at the specific socket id
      const uid = this.GetUidFromSocketId(socket.id);

      // if there was a valid uid returned, delete that user from the users object and send the updated array to the client
      if(uid) {
        delete this.users[uid];
        const users = Object.values(this.users);
        this.SendMessage('user_disconnected', users, socket.id);
      }
    });
  }

  //// HELPER FUNCTIONS ////

  // inserting socket id of type string and finding the user within the users dictionary object
  GetUidFromSocketId = (id: string) => Object.keys(this.users).find((uid) => {
    this.users[uid] === id});

  // name is name of socket, users is list of socket ids, payload is information needed by the user for state updates
  SendMessage = (name: string, users: string[], payload?: Object) => {
    console.info('Emitting event: ' + name + ' to ', users);
    users.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)));
  }
};
