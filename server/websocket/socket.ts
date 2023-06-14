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

    socket.on('handshake', () => {
      console.info('handshake received from ' + socket.id);
    });

    socket.on('disconnect', () => {
      console.info('Disconnect received from ' + socket.id)
    })
  }
}