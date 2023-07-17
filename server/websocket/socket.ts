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
    socket.on('handshake', async (user, pathname) => {

      if (!user) {
        socket.emit('handshake_reply', {}, 'fail');
        console.log('user was null for some reason, dang it Auth0!');
      }

      console.log('handshake from:', user.nickname, 'at', pathname)

      let player = null;

      try {
        const existingUser = await this.FindUserByAuthId(user.sub);

        if (existingUser) {
          player = existingUser;

          // if the user exists, update the socket.id
          await this.UserUpdate('socketId', socket.id, 'authId', user.sub);

          if (existingUser.gameId.length) {
            // now see if they were part of the game
            const existingGame = await this.FindGameByGameId(existingUser.gameId)

            // if they have a gameId
            if (existingGame && existingGame.dataValues !== undefined) {
              console.log('existing game on handshake:', existingGame.dataValues)

              const endpoint = await this.RedirectIfGaming(existingGame.dataValues.status);

              // if the game is over, redirect them home, delete the game if there was only one user
              if (endpoint === '/gameover' || endpoint === '/home') {
                await this.UserUpdate('gameId', '', 'authId', user.sub);
                socket.leave(existingGame.gameId);
                socket.join('users');
                await this.EmitGeneralUpdates()

                if (existingGame.users.length < 2) {
                  await Game.destroy({ where: { gameId: existingGame.gameId } });
                }

                socket.emit('handshake_reply', player, '/home');

              } else {

                // if the game isn't over, but there's only one player in the game WHICH IS THEM, delete the game and send them home
                if (existingGame.users.length < 2 && existingGame.users.includes(user.sub)) {
                  await Game.destroy({ where: { gameId: existingGame.gameId } });
                  await this.UserUpdate('gameId', '', 'authId', user.sub);
                  socket.leave(existingGame.gameId);
                  socket.join('users');
                  await this.EmitGeneralUpdates()
                  socket.emit('handshake_reply', player, '/home');

                  // the game isn't over and there's more than one player, add them back into the game
                } else if (!existingGame.users.includes(existingUser.authId) && existingGame.users.length > 2) {
                  await this.GameUpdateUsers([...existingGame.users, existingUser.authId], 'gameId', existingUser.gameId);
                  await this.UserUpdate('gameId', existingGame.gameId, 'authId', user.sub);
                  console.log('put user back in game')
                  socket.leave('users');
                  socket.join(existingUser.gameId);
                  await this.EmitLobbyUpdates(existingUser.gameId);
                  socket.emit('handshake_reply', player, endpoint);
                }
              }

              // no existing game exists
            } else {
              await this.UserUpdate('gameId', '', 'authId', user.sub);
              socket.join('users');
              // send new user to all connected users to update their state
              await this.EmitGeneralUpdates()
            }
          }

        } else {
          console.log('new user, adding them to the database first');

          let username = user.name;

          if (user.name.includes('@')) {
            username = user.nickname;
          }

          const newUser = await User.create({   // kept old post request on homepage the same, just adding socket id directly
            username: username,
            email: user?.email,
            authId: user?.sub,
            image: user?.picture || null,
            largeFont: false,
            socketId: socket.id,
          })

          player = newUser.dataValues;

          socket.join('users');
          await this.EmitGeneralUpdates()
        }

        if (pathname === '/lobby' || pathname === '/onthehunt' || pathname === '/gameover') {
          socket.emit('handshake_reply', player, '/home');
        } else {
          socket.emit('handshake_reply', player, '');
        }

      } catch (err) {
        console.error('the user is null, are they not?', err);
        socket.emit('handshake_reply', {}, 'fail');
      }

    });

    // when client emits a createGame event, make the new game
    socket.on('create_game', async (user, toClient) => {

      try {
        const hostingGame = await Game.findOne({ where: { host: user.sub } });
        if (hostingGame) {

          const endpoint = await this.RedirectIfGaming(hostingGame.dataValues.status);

          if (endpoint === '/home') {
            await this.LeaveTheGame(socket, user);
            await this.EmitLobbyGamesUpdates(hostingGame.dataValues.gameId);
            socket.leave(hostingGame.dataValues.gameId);
            socket.join('users');
          } else {
            socket.leave('users');
            socket.join(hostingGame.dataValues.gameId);
            console.log('already hosting a game');
          }
          toClient(endpoint);

        } else {
          const gameId = v4();
          let hostName = user.name;
          const index = hostName.indexOf("@");
          if (index !== -1) {
            hostName = hostName.substring(0, index);
          }
          const newGame = await Game.create({ gameId: gameId, host: user.sub, hostName: hostName, status: 'lobby', users: [user.sub], hunted: '' });
          await this.UserUpdate('gameId', gameId, 'authId', user.sub);

          socket.leave('users');
          await this.EmitGamesUpdates();
          socket.join(gameId);
          await this.EmitLobbyUpdates(newGame.dataValues.gameId);
          toClient('/lobby');
        }

      } catch (err) {
        console.log(err);
      }

    });

    socket.on('join_game', async (host, user, toClient) => {
      // console.log(host)
      try {
        const game = await this.GameFindOne('host', host);

        if (game) {
          if (game.users.includes(user.sub)) {
            socket.leave('users');
            console.log('user already in that game')
          } else {
            await this.UserUpdate('gameId', game.gameId, 'authId', user.sub);
            await this.GameUpdateUsers([...game.users, user.sub], 'host', host);

          }

          socket.leave('users');
          await this.EmitGeneralUpdates()
          socket.join(game.gameId);
          await this.EmitLobbyUpdates(game.gameId);

          // redirecting the user to the lobby
          toClient('/lobby');

        } else {
          console.log('no game with that host exists')
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

        const locations = await Locations.findAll({ where: { gameId: gameId } });

        this.io.to(gameId).emit('update_locations', locations);
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
          await this.EmitLobbyGamesUpdates(victim.gameId)

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
          await this.EmitLobbyGamesUpdates(game.gameId)

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

          await this.EmitLobbyGamesUpdates(game.gameId)

        } else {
          console.log('no game like that exists')
        }
      } catch (err) {
        console.log(err);
      }

    });

    socket.on('leave_game', async (user) => {
      await this.LeaveTheGame(socket, user);
    });

    socket.on('update_game_timer', async (time, user) => {

      try {
        const existingUser = await this.FindUserByAuthId(user.sub);
        const game = await this.FindGameByGameId(existingUser.gameId)
        if (game) {
          await this.GameUpdate('timeConstraints', time, 'gameId', game.gameId);
          await this.EmitLobbyGamesUpdates(game.gameId)

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
          await this.EmitLobbyGamesUpdates(game.gameId)

        } else {
          console.log('no game like that exists')
        }
      } catch (err) {
        console.log(err);
      }

    });

    socket.on('nav_to_endpoint', async (endpoint) => {
      if (socket.rooms.has('users')) {
        // if (endpoint === '/onthehunt' || endpoint === '/gameover' || endpoint === '/lobby') {
        if (endpoint === '/onthehunt' || endpoint === '/gameover') {
          socket.emit('redirect', '/home');
        }
      }
    });


    // when the disconnect occurs
    socket.on('disconnect', async () => {
      console.log('There was a socket disconnection');
      try {
        const user = await this.UserFindOne('socketId', socket.id);
        if (user) {
          //have the user leave the game
          const matchFuncParamsForUser = { sub: user.authId }
          if (user.gameId) {
            await this.LeaveTheGame(socket, matchFuncParamsForUser);
            socket.leave(user.gameId);
            await this.EmitLobbyGamesUpdates(user.gameId)
          }
          // delete the socket id from the user since they're not connected anymore
          await this.UserUpdate('socketId', '', 'socketId', socket.id);
          // console.log('Removed socket from disconnected user');
        }
        socket.leave('users');
        this.EmitGeneralUpdates();
      } catch (err) {
        console.log('error on socket disconnection:', err);
      }
    });
  };


  // HELPER FUNCTIONS

  ///// Sequelize Queries ////

  // user
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

  // game
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
  ///////////////////////////

  // socket emits
  EmitLobbyUpdates = async (gameId: string) => {
    const users = await User.findAll({ where: { gameId: gameId } })
    this.io.to(gameId).emit('update_lobby_users', users);

    const games = await Game.findAll({ where: { gameId: gameId } });
    this.io.to(gameId).emit('update_lobby_games', games);
  }

  EmitLobbyGamesUpdates = async (gameId: string) => {
    const games = await Game.findAll({ where: { gameId: gameId } });
    this.io.to(gameId).emit('update_lobby_games', games);
  }

  EmitGeneralUpdates = async () => {
    const games = await Game.findAll();
    this.io.to('users').emit('update_games', games);

    const users = await User.findAll({ where: { socketId: { [Op.and]: [{ [Op.not]: null }, { [Op.not]: '' }] } } });
    this.io.to('users').emit('update_users', users);

  }

  EmitGamesUpdates = async () => {
    const games = await Game.findAll();
    this.io.to('users').emit('update_games', games);
  }

  //// reusable logic ////

  //leave game
  LeaveTheGame = async (socket, user) => {
    try {
      // get the user so that can get the game
      const existingUser = await this.FindUserByAuthId(user.sub);
      const game = await this.FindGameByGameId(existingUser.gameId)
      // if that game exists
      if (game) {
        // if the game has this user within the users array
        if (game.users.includes(user.sub)) {
          try {
            await Locations.destroy({ where: { authId: user.sub } });
          } catch (err) {
            console.log('no location to destroy for that user')
          }
          // update the users list to not have the user in there anymore so the game list can be updated
          const updatedUserList = game.users.filter((authId: string) => authId !== user.sub);
          // if there's no more users in the game, destroy the game
          if (!updatedUserList.length) {
            await Game.destroy({ where: { gameId: game.gameId } });
            // making sure there is no trace of the gameId in other users
            const usersToUpdate = await User.findAll({ where: { gameId: game.gameId } });
            await Promise.all(usersToUpdate.map(user => user.update({ gameId: '' })));
            await Locations.destroy({ where: { gameId: game.gameId } });
            console.log('Game deleted, no more users in game');
            console.log('Locations deleted, no more users in game')
            // if there's still people in the game
          } else {
            // the host is the current host
            let host = game.host;
            let hostName = game.hostName;
            let victim = game.hunted;
            // if the host was the user leaving the game, pick a random host
            if (game.host === user.sub) {
              const newHost = await this.FindUserByAuthId(updatedUserList[Math.floor(Math.random() * updatedUserList.length)]);
              host = newHost.authId;
              hostName = newHost.username;
            }
            // if hunted was the leaving user, pick a random new hunted
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
          await socket.leave(game.gameId);
          // update the user so that they don't have the gameId anymore
          await this.UserUpdate('gameId', '', 'authId', user.sub);
          await this.EmitLobbyUpdates(game.gameId);

          // put that user back into the users room and leave the game room
          await socket.join('users');
          await this.EmitGeneralUpdates()
        } else {
          console.log('game did not have that user');
        }
      } else {
        console.log(`tried to leave game, game does not exist with the gameId that the user provided: ${existingUser.gameId}!
no biggie, it may have been a generic request from the home page.`);
      }
    } catch (err) {
      console.log('something went wrong when trying to leave the game:', err);
    }
  }

  RedirectIfGaming = async (status: string) => {
    switch (status) {
      case 'complete':
        return '/gameover'
      case 'ongoing':
        return '/onthehunt'
      case 'lobby':
        return '/lobby'
      default:
        return '/home'
    }
  }

}
