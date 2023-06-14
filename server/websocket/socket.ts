import { Server as HTTPServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

export class ServerSocket {
  public static instance: ServerSocket; // static property, accessed directly through the class rather than instances of the class
  public io: Server; // public property io of type server

  // Master list of all connected users, dictionary object
  // key is the user id and the value is the socket id to send messages to the correct clients
  public users: { [uuid: string]: string}

  constructor(server: HTTPServer) {
    ServerSocket.instance = this; // have access to the only instance of this socket class
    this.users = {}; // initializing the empty users object
    this.io = new Server(server, { // new instance of the server class from socket.io, has basic options from socket.io website
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: '*'   // NOT SAFE NEED TO CHANGE
      }
    });

    this.io.on('connect', this.StartListeners); // when client connects, start the listeners for events in the StartListeners method

    console.info('Socket IO started'); // server side console log to let us know that socket connected to the server
  }

  // method to handle all of the socket functions
  StartListeners = (socket: Socket) => {
    console.info('Message received from ' + socket.id);

    socket.on('handshake', (callback:(uid: string, users:string[]) => void) => {
      console.info('handshake received from ' + socket.id);

      // reconnection attempt?
      const reconnected = Object.keys(this.users).includes(socket.id);

      if(reconnected) {
        console.info('User has reconnected');
        const uid = this.GetUidFromSocketId(socket.id);
        const users = Object.keys(this.users);

        if(uid) {
          console.info('Sending callback for reconnect...');
          callback(uid, users);
          return;
        }
      }

      // Generate new user
      const uid = v4();
      this.users[uid] = socket.id;
      const users = Object.keys(this.users);

      console.info('Sending callback for handshake...');
      callback(uid, users);

      // Send new user to all connected users
      this.SendMessage(
        'user_connected',
        users.filter((id) => id !== socket.id),
        users
      );
    });

    socket.on('disconnect', () => {
      console.info('Disconnect received from ' + socket.id)
    })
  }

  GetUidFromSocketId = (id: string) => Object.keys(this.users).find((uid) => this.users[uid] === id);

  // name is name of socket, users is list of socket ids, payload is information needed by the user for state updates
  SendMessage = (name: string, users: string[], payload?: Object) => {
    console.info('Emitting event: ' + name + ' to ', users);
    users.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)));
  }
}