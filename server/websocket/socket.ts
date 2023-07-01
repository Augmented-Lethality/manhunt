import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';
import { User, Game, Locations } from '../database/models';

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

  public users: [];


  // dictionary object of connected games
  // key is the host (the user id of who created the game)
  // the object holds the game id, and authIdList which is the list of connected users
  public games: [];

  // new locations object, key is the user id, stores the long and lat as number values
  public locations: [];


  // constructor automatically called when an instance of a class is created, meaning when the server starts, this socket server
  // will be created and the items within the constructor will be performed automatically
  constructor(server: HttpServer) {
    // the only server connection to socket.io is to this instance's STATIC ServerSocket
    ServerSocket.instance = this;
    // initializing the empty users
    this.users = [];
    // initializing the empty games
    this.games = [];

    // initializing the empty locations
    this.locations = [];


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

      try {

        // if the user exists, update the new socket connection
        const existingUser = await User.findOne({ where: { authId: user.sub } });
        if (existingUser) {
          // If the user exists, update the socket.id
          await User.update({ socketId: socket.id }, { where: { authId: user.sub } })
          // console.log('updated db user connection')


          // now see if they were part of the game
          const existingGame = await Game.findOne({ where: { gameId: existingUser.dataValues.gameId } })
          // if the game exists on their model and the user isn't in the game list, add them back
          if (existingGame) {
            if (!existingGame.dataValues.users.includes(existingUser.dataValues.authId)) {
              await Game.update({ users: [...existingGame.dataValues.users, existingUser.dataValues.authId] },
                { where: { gameId: existingUser.dataValues.gameId } });
            }
            console.log('put user back in game')
            socket.join(existingUser.dataValues.gameId);
            this.io.to(existingUser.dataValues.gameId).emit('update_lobby_users');
            this.io.to(existingUser.dataValues.gameId).emit('update_lobby_games');

          } else {
            if (existingUser.dataValues.gameId.length > 0 || existingUser.dataValues.gameId !== null) {
              await User.update({ gameId: '' }, { where: { authId: user.sub } });
            }
            console.log('joined users')
            socket.join('users');
          }

        }

      } catch (err) {
        console.error(err);
      }

      // send new user to all connected users to update their state
      this.io.to('users').emit('update_users');
      this.io.to('users').emit('update_games');
      socket.emit('handshake_reply', 'success');

    });

    // when client emits a createGame event, make the new game
    socket.on('create_game', async (user) => {

      try {
        const hostingGame = await Game.findOne({ where: { host: user.sub } });
        if (hostingGame) {
          socket.leave('users');
          console.log('already hosting a game');
        } else {
          const gameId = v4();
          const hostName = user.name;
          await Game.create({ gameId: gameId, host: user.sub, hostName: hostName, status: 'lobby', users: [user.sub], hunted: '' });
          await User.update({ gameId: gameId }, { where: { authId: user.sub } })
          socket.join(gameId);
          this.io.to(gameId).emit('update_lobby_users');
          this.io.to(gameId).emit('update_lobby_games');

        }
        // send new user to all connected users to update their games lists
        socket.leave('users');
        this.io.to('users').emit('update_games');

      } catch (err) {
        console.log(err);
      }

    });

    socket.on('join_game', async (host, user) => {
      console.log(host)
      try {
        const game = await Game.findOne({ where: { host: host } });
        if (game) {
          if (game.dataValues.users.includes(user.sub)) {
            console.log('user already in that game')
          } else {
            await User.update({ gameId: game.dataValues.gameId }, { where: { authId: user.sub } });
            await Game.update({ users: [...game.dataValues.users, user.sub] }, { where: { host: host } });
          }

          socket.join(game.dataValues.gameId);
          socket.leave('users');
          this.io.to(game.dataValues.gameId).emit('update_lobby_users');
          this.io.to(game.dataValues.gameId).emit('update_lobby_games');

          this.io.to('users').emit('update_games');

        } else {
          console.log('no game with that host exists')
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('join_lobby', async (host, user) => {
      try {
        const game = await Game.findOne({ where: { host: host } });
        if (game) {
          if (game.dataValues.users.includes(user.sub)) {
            console.log('user in game we good, updating the game lobby')
          } else {
            await User.update({ gameId: game.dataValues.gameId }, { where: { authId: user.sub } });
            await Game.update({ users: [...game.dataValues.users, user.sub] }, { where: { host: host } });

            this.io.to('users').emit('update_games');

          }

          socket.leave('users');
          socket.join(game.dataValues.gameId);

          this.io.to(game.dataValues.gameId).emit('update_lobby_users');
          this.io.to(game.dataValues.gameId).emit('update_lobby_games');

        } else {

        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('reconnect_in_game', async (user) => {

      try {
        const existingUser = await User.findOne({ where: { authId: user.sub } });

        if (existingUser) {
          const game = await Game.findOne({ where: { gameId: existingUser.dataValues.gameId } });

          if (game) {
            if (!game.dataValues.users.includes(user.sub)) {
              await Game.update({ users: [...game.users, user.sub] }, { where: { gameId: existingUser.dataValues.gameId } });
              socket.join(existingUser.dataValues.gameId);

              console.log('user in game again, updating the game lobby')
              this.io.to(existingUser.dataValues.gameId).emit('update_lobby_users');
              this.io.to(existingUser.dataValues.gameId).emit('update_lobby_games');
            }
          } else {
            console.log('no game with that host exists')
          }
        }

      } catch (err) {
        console.log(err);
      }
    });

    socket.on('reconnect_user', async (user) => {

      try {
        const existingUser = await User.findOne({ where: { authId: user.sub } });

        if (existingUser) {
          const game = await Game.findOne({ where: { gameId: existingUser.dataValues.gameId } });

          if (game) {
            if (!game.dataValues.users.includes(user.sub)) {
              await Game.update({ users: [...game.users, user.sub] }, { where: { gameId: existingUser.dataValues.gameId } });
              socket.join(existingUser.dataValues.gameId);

              console.log('user in game again, updating the game lobby')
              this.io.to(existingUser.dataValues.gameId).emit('update_lobby_users');
              this.io.to(existingUser.dataValues.gameId).emit('update_lobby_games');
            }
          }
        } else {
          console.log('no game with that host exists, reconnecting to users room')
          await User.update({ socketId: socket.id }, { where: { authId: user.sub } })
          if (!socket.rooms.has('users')) {
            socket.join('users');
          }
          this.io.to('users').emit('update_users');
          this.io.to('users').emit('update_games');
        }

      } catch (err) {
        console.log(err);
      }
    });


    // adding/updating a location
    socket.on('add_location', async (user, gameId, longitude, latitude) => {
      try {
        const location = await Locations.findOne({ where: { authId: user.sub } });
        if (location) {
          await Locations.update({ longitude: longitude, latitude: latitude }, { where: { authId: user.sub } });
          console.log('updated user location')
        } else {
          await Locations.create({ authId: user.sub, gameId: gameId, longitude: longitude, latitude: latitude })
          console.log('made new location')
        }
        this.io.to(gameId).emit('update_locations');
      } catch (err) {
        console.log(err);
      }
    });


    socket.on('set_hunted', async (victim) => {

      try {
        const game = await Game.findOne({ where: { gameId: victim.gameId } });
        if (game) {
          await Game.update({ hunted: victim.authId }, { where: { gameId: victim.gameId } });
          console.log('hunter set');
          this.io.to(victim.gameId).emit('update_lobby_games');

        } else {
          console.log('no game like that exists')
        }
      } catch (err) {
        console.log(err);
      }

    });

    socket.on('update_game_status', async (user, status) => {
      console.log(status);
      try {
        const existingUser = await User.findOne({ where: { authId: user.sub } });
        const game = await Game.findOne({ where: { gameId: existingUser?.dataValues.gameId } });
        if (game) {
          await Game.update({ status: status }, { where: { gameId: existingUser?.dataValues.gameId } });
          console.log('game status updated to:', status);
          this.io.to(game.dataValues.gameId).emit('update_lobby_games');

        } else {
          console.log('no game like that exists')
        }
      } catch (err) {
        console.log(err);
      }

    });

    socket.on('game_stats', async (user) => {
      try {
        const existingUser = await User.findOne({ where: { authId: user.sub } });
        const game = await Game.findOne({ where: { gameId: existingUser?.dataValues.gameId } });
        if (game) {
          await Game.update({ winnerId: user.sub }, { where: { gameId: existingUser?.dataValues.gameId } });
          console.log('winner added');
          await User.update({
            gamesWon: existingUser?.dataValues.gamesWon + 1,
            killsConfirmed: existingUser?.dataValues.killsConfirmed + 1,
            gamesPlayed: existingUser?.dataValues.gamesPlayed + 1,
          }, { where: { authId: user.sub } });
          this.io.to(game.dataValues.gameId).emit('update_lobby_games');

        } else {
          console.log('no game like that exists')
        }
      } catch (err) {
        console.log(err);
      }

    });

    socket.on('leave_game', async (user) => {
      try {
        // get the user so that can get the game
        const existingUser = await User.findOne({ where: { authId: user.sub } });
        console.log('gameId in question:', existingUser?.dataValues.gameId)
        const game = await Game.findByPk(existingUser?.dataValues.gameId);

        // if that game exists
        if (game) {
          // if the game has this user within the users array
          if (game.dataValues.users.includes(user.sub)) {

            // update the user so that they don't have the gameId anymore
            await User.update({ gameId: '' }, { where: { authId: user.sub } });

            const location = await Locations.findByPk(user.sub);

            if (location) {
              await Locations.destroy({ where: { authId: user.sub } });
            }

            // update the users list to not have the user in there anymore so the game list can be updated
            const updatedUserList = game.dataValues.users.filter((authId: string) => authId !== existingUser?.dataValues.authId);

            // if there's no more users in the game, destroy the game
            if (updatedUserList.length === 0) {
              await Game.destroy({ where: { gameId: game.dataValues.gameId } });
              await Locations.destroy({ where: { gameId: game.dataValues.gameId } });
              console.log('Game deleted');
              console.log('Locations deleted')

            } else {
              // the host is the current host
              let host = game.dataValues.host;
              let hostName = game.dataValues.hostName;
              let victim = game.dataValues.hunted;

              // if the host was the user leaving the game, set the new host as the person in the first index of the users array
              if (game.dataValues.host === user.sub) {
                const newHost = await User.findOne({ where: { authId: updatedUserList[0] } });
                if (newHost) {
                  host = newHost.dataValues.authId;
                  hostName = newHost.dataValues.username;

                }
                host = updatedUserList[0];

              }

              if (game.dataValues.hunted === user.sub) {
                victim = updatedUserList[Math.floor(Math.random() * updatedUserList.length)];

              }

              // update the game with the new users list and either new host or same host
              await Game.update(
                { users: updatedUserList, host: host, hostName: hostName, hunted: victim },
                { where: { gameId: game.dataValues.gameId } }
              )

            }


            // update everyone on the new players and games
            this.io.to(game.dataValues.gameId).emit('update_lobby_users');
            this.io.to(game.dataValues.gameId).emit('update_lobby_games');
            // put that user back into the users room and leave the game room
            socket.leave(game.dataValues.gameId);
            socket.join('users');
            this.io.to('users').emit('update_games');
            this.io.to('users').emit('update_users');



          } else {
            console.log('game did not have that user');
          }

        } else {
          console.log('no game like that exists')
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('update_game_timer', async (time, user) => {
      try {
        const existingUser = await User.findOne({ where: { authId: user.sub } });
        const game = await Game.findOne({ where: { gameId: existingUser?.dataValues.gameId } });
        if (game) {
          await Game.update({ timeConstraints: time }, { where: { gameId: existingUser?.dataValues.gameId } });
          console.log('timer added');
          this.io.to(game.dataValues.gameId).emit('update_lobby_games');

        } else {
          console.log('no game like that exists')
        }
      } catch (err) {
        console.log(err);
      }

    });

    socket.on('update_game_start', async (time, user) => {
      try {
        const existingUser = await User.findOne({ where: { authId: user.sub } });
        const game = await Game.findOne({ where: { gameId: existingUser?.dataValues.gameId } });
        if (game) {
          await Game.update({ timeStart: time }, { where: { gameId: existingUser?.dataValues.gameId } });
          console.log('game start added');
          this.io.to(game.dataValues.gameId).emit('update_lobby_games');

        } else {
          console.log('no game like that exists')
        }
      } catch (err) {
        console.log(err);
      }

    });



    // when the disconnect occurs
    socket.on('disconnect', async () => {
      console.log('there was a socket disconnection')

      try {
        const user = await User.findOne({ where: { socketId: socket.id } });
        if (user) {
          const game = await Game.findByPk(user.dataValues.gameId);

          // remove user from the list of users in the game since they're disconnected
          if (game) {
            const updatedUserList = game.dataValues.users.filter((authId: string) => authId !== user.dataValues.authId);

            // if this user was the only user, then delete the game instead
            if (updatedUserList.length === 0) {
              await Game.destroy({ where: { gameId: game.dataValues.gameId } });

              const location = await Locations.findByPk(user.dataValues.authId);

              if (location) {
                await Locations.destroy({ where: { authId: user.dataValues.authId } });
                console.log('deleted locations')
              }
            } else {
              await Game.update(
                { users: updatedUserList },
                { where: { gameId: user.dataValues.gameId } }
              )
            }


            socket.leave(user.dataValues.gameId);
            // send new games to all connected users to update their games lists
            this.io.to(user.dataValues.gameId).emit('update_games');
            // send new user to all connected users to update their state
            this.io.to(user.dataValues.gameId).emit('update_users');


          }

          // delete the socket id from the user since they're not connected anymore
          await User.update(
            { socketId: '' },
            { where: { socketId: socket.id } }
          )
          console.log('removed socket from disconnected user:')
        }
        socket.leave('users');

        // send new games to all connected users to update their games lists
        this.io.to('users').emit('update_games');
        // send new user to all connected users to update their state
        this.io.to('users').emit('update_users');


      } catch (err) {
        console.log(err);
      }

    });
  };


}
