import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';
import { User, Game, Locations } from '../database/models';
import { Op } from 'sequelize';

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
  }

  // method to handle all of the client emits
  StartListeners = (socket: Socket) => {

    // client is asking to make a socket connection to the server, also known as a handshake
    socket.on('handshake', async (user) => {

      try {
        // if the user exists, update the new socket connection
        const existingUser = await this.FindUserByAuthId(user.sub);
        if (existingUser) {
          // If the user exists, update the socket.id
          await this.UserUpdate('socketId', socket.id, 'authId', user.sub);
          // console.log('updated db user connection')


          // now see if they were part of the game
          const existingGame = await this.FindGameByGameId(existingUser.gameId)
          // if the game exists on their model and the user isn't in the game list, add them back
          if (existingGame) {
            if (!existingGame.users.includes(existingUser.authId)) {
              await this.GameUpdateUsers([...existingGame.users, existingUser.authId], 'gameId', existingUser.gameId);
            }
            console.log('put user back in game')
            socket.join(existingUser.gameId);
            this.EmitLobbyUpdates(existingUser.gameId);

          } else {
            if (existingUser.gameId.length > 0 || existingUser.gameId !== null) {
              await this.UserUpdate('gameId', '', 'authId', user.sub);

            } else if (existingUser.gameId === null) {
              await this.UserUpdate('gameId', '', 'authId', user.sub);
            }
            socket.join('users');
          }

        }

      } catch (err) {
        console.error(err);
      }

      // send new user to all connected users to update their state
      this.EmitGeneralUpdates()
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
          await this.UserUpdate('gameId', gameId, 'authId', user.sub);

          socket.join(gameId);
          this.EmitLobbyUpdates(gameId);

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
        const game = await this.GameFindOne('host', host);

        if (game) {
          if (game.users.includes(user.sub)) {
            console.log('user already in that game')
          } else {
            await this.UserUpdate('gameId', game.gameId, 'authId', user.sub);
            await this.GameUpdateUsers([...game.users, user.sub], 'host', host);

          }

          socket.join(game.gameId);
          this.EmitLobbyUpdates(game.gameId);

          socket.leave('users');
          this.EmitGeneralUpdates()


        } else {
          console.log('no game with that host exists')
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('join_lobby', async (host, user) => {
      try {
        const game = await this.GameFindOne('host', host);
        if (game) {
          if (game.users.includes(user.sub)) {
            // they're already in the game, don't need to add them
          } else {
            await this.UserUpdate('gameId', game.gameId, 'authId', user.sub);
            await this.GameUpdateUsers([...game.users, user.sub], 'host', host);
            // this.io.to('users').emit('update_games');
          }

          socket.leave('users');
          this.EmitGeneralUpdates()

          socket.join(game.gameId);
          this.EmitLobbyUpdates(game.gameId);

        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('reconnect_in_game', async (user) => {

      try {
        const existingUser = await this.FindUserByAuthId(user.sub);

        if (existingUser) {
          const game = await this.FindGameByGameId(existingUser.gameId)

          if (game) {
            if (!game.users.includes(user.sub)) {
              await this.GameUpdateUsers([...game.users, user.sub], 'gameId', existingUser.gameId);
              socket.join(existingUser.gameId);

              this.EmitLobbyUpdates(existingUser.gameId);
            }
          } else {
            console.log('can not reconnect, no game with that host exists')
          }
        }

      } catch (err) {
        console.log(err);
      }
    });

    socket.on('reconnect_user', async (user) => {

      try {
        const existingUser = await this.FindUserByAuthId(user.sub);

        if (existingUser) {
          const game = await this.FindGameByGameId(existingUser.gameId)

          if (game) {
            if (!game.users.includes(user.sub)) {
              await this.GameUpdateUsers([...game.users, user.sub], 'gameId', existingUser.gameId);
              socket.join(existingUser.gameId);

              console.log('user in game again, updating the game lobby')
              this.EmitLobbyUpdates(existingUser.gameId);
            }
          }
        } else {
          await this.UserUpdate('socketId', socket.id, 'authId', user.sub);

          if (!socket.rooms.has('users')) {
            socket.join('users');
          }
          this.EmitGeneralUpdates()
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
        const game = await this.FindGameByGameId(victim.gameId)

        if (game) {

          await this.GameUpdate('hunted', victim.authId, 'gameId', victim.gameId);

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
        const existingUser = await this.FindUserByAuthId(user.sub);
        const game = await this.FindGameByGameId(existingUser.gameId)
        if (game) {
          await this.GameUpdate('status', status, 'gameId', existingUser?.gameId);

          console.log('game status updated to:', status);
          this.io.to(game.gameId).emit('update_lobby_games');

        } else {
          console.log('no game like that exists')
        }
      } catch (err) {
        console.log(err);
      }

    });

    socket.on('update_ready_state', async (ready) => {
      try {
        const existingUser = await this.UserFindOne('socketId', socket.id);

        this.io.to(existingUser?.gameId).emit('update_ready', ready);

      } catch (err) {
        console.log(err);
      }

    });

    socket.on('game_stats', async (user) => {
      try {
        const existingUser = await this.FindUserByAuthId(user.sub);
        const game = await this.FindGameByGameId(existingUser.gameId)
        if (game) {
          await this.GameUpdate('winnerId', user.sub, 'gameId', existingUser?.gameId);

          console.log('winner added');
          await User.update({
            gamesWon: existingUser?.gamesWon + 1,
            killsConfirmed: existingUser?.killsConfirmed + 1,
            gamesPlayed: existingUser?.gamesPlayed + 1,
          }, { where: { authId: user.sub } });
          this.io.to(game.gameId).emit('update_lobby_games');

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
        const existingUser = await this.FindUserByAuthId(user.sub);
        const game = await this.FindGameByGameId(existingUser.gameId)

        // if that game exists
        if (game) {
          // if the game has this user within the users array
          if (game.users.includes(user.sub)) {

            // update the user so that they don't have the gameId anymore
            await this.UserUpdate('gameId', '', 'authId', user.sub);

            const location = await Locations.findByPk(user.sub);

            if (location) {
              await Locations.destroy({ where: { authId: user.sub } });
            }

            // update the users list to not have the user in there anymore so the game list can be updated
            const updatedUserList = game.users.filter((authId: string) => authId !== existingUser?.authId);

            // if there's no more users in the game, destroy the game
            if (updatedUserList.length === 0) {

              await Game.destroy({ where: { gameId: game.gameId } });

              // making sure there is no trace of the gameId in other users
              const usersToUpdate = await User.findAll({ where: { gameId: game.gameId } });
              await Promise.all(usersToUpdate.map(user => user.update({ gameId: '' })));
              await Locations.destroy({ where: { gameId: game.gameId } });

              console.log('Game deleted, no more users in game');
              console.log('Locations deleted, no more users in game')

            } else {
              // the host is the current host
              let host = game.host;
              let hostName = game.hostName;
              let victim = game.hunted;

              // if the host was the user leaving the game, set the new host as the person in the first index of the users array
              if (game.host === user.sub) {
                const newHost = await this.FindUserByAuthId(updatedUserList[0]);

                if (newHost) {
                  host = newHost.authId;
                  hostName = newHost.username;

                }
                host = updatedUserList[0];

              }

              if (game.hunted === user.sub) {
                victim = updatedUserList[Math.floor(Math.random() * updatedUserList.length)];

              }

              // update the game with the new users list and either new host or same host
              await Game.update(
                { users: updatedUserList, host: host, hostName: hostName, hunted: victim },
                { where: { gameId: game.gameId } }
              )

            }

            // update everyone on the new players and games
            this.EmitLobbyUpdates(game.gameId);
            // put that user back into the users room and leave the game room
            socket.leave(game.gameId);
            socket.join('users');
            this.EmitGeneralUpdates()

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
        const existingUser = await this.FindUserByAuthId(user.sub);
        const game = await this.FindGameByGameId(existingUser.gameId)
        if (game) {
          await this.GameUpdate('timeConstraints', time, 'gameId', existingUser?.gameId);
          console.log('timer added');
          this.io.to(game.gameId).emit('update_lobby_games');

        } else {
          console.log('no game like that exists')
        }
      } catch (err) {
        console.log(err);
      }

    });

    socket.on('update_game_start', async (time, user) => {
      try {
        const existingUser = await this.FindUserByAuthId(user.sub);
        const game = await this.FindGameByGameId(existingUser.gameId)
        if (game) {
          await this.GameUpdate('timeStart', time, 'gameId', existingUser?.gameId);
          this.io.to(game.gameId).emit('update_lobby_games');

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
        const user = await this.UserFindOne('socketId', socket.id);
        if (user) {
          const game = await this.FindGameByGameId(user.gameId)

          // remove user from the list of users in the game since they're disconnected
          if (game) {
            const updatedUserList = game.users.filter((authId: string) => authId !== user.authId);

            // if this user was the only user, then delete the game instead
            if (updatedUserList.length === 0) {
              await Game.destroy({ where: { gameId: game.gameId } });

              const location = await Locations.findByPk(user.authId);

              if (location) {
                await Locations.destroy({ where: { authId: user.authId } });
                console.log('deleted locations')
              }
            } else {

              this.GameUpdateUsers(updatedUserList, 'gameId', user.gameId);
            }

            socket.leave(user.gameId);
            this.EmitLobbyUpdates(user.gameId);
          }

          // delete the socket id from the user since they're not connected anymore
          await this.UserUpdate('socketId', '', 'socketId', socket.id);

          console.log('removed socket from disconnected user:')
        }
        socket.leave('users');
        this.EmitGeneralUpdates()

      } catch (err) {
        console.log(err);
      }

    });
  };


  // HELPER FUNCTIONS

  // sequelize queries
  FindUserByAuthId = async (authId: string) => {
    const existingUser = await User.findOne({ where: { authId } });
    return existingUser?.dataValues;
  }

  UserFindOne = async (key: string, value: string) => {
    const existingUser = await User.findOne({ where: { [key]: value } });
    return existingUser?.dataValues;
  }

  UserUpdate = async (newKey: string, newValue: string, searchKey: string, searchValue: string) => {
    await User.update({ [newKey]: newValue }, { where: { [searchKey]: searchValue } });
  }

  GameUpdate = async (newKey: string, newValue: string, searchKey: string, searchValue: string) => {
    await Game.update({ [newKey]: newValue }, { where: { [searchKey]: searchValue } });
  }

  GameUpdateUsers = async (newValue: Array<string>, searchKey: string, searchValue: string) => {
    await Game.update({ users: newValue }, { where: { [searchKey]: searchValue } });
  }

  GameFindOne = async (key: string, value: string) => {
    const existingGame = await Game.findOne({ where: { [key]: value } });
    return existingGame?.dataValues;
  }

  FindGameByGameId = async (gameId: string) => {
    const existingGame = await Game.findOne({ where: { gameId } });
    return existingGame?.dataValues;
  }

  // socket emits
  EmitLobbyUpdates = (gameId: string) => {
    this.io.to(gameId).emit('update_lobby_users');
    this.io.to(gameId).emit('update_lobby_games');
  }

  EmitGeneralUpdates = async () => {
    const users = await User.findAll({ where: { socketId: { [Op.and]: [{ [Op.not]: null }, { [Op.not]: '' }] } } });

    this.io.to('users').emit('update_users', users);
    this.io.to('users').emit('update_games');
  }


}
