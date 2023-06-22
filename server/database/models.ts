import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class User extends Model { }
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      isEmail: true
    }
  },
  authId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  facialDescriptions: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    allowNull: true
  },
  uid: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true
  },
  socketId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tfModelPath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gamesPlayed: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gamesWon: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  killsConfirmed: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, { sequelize });

class Friends extends Model { }
Friends.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  friendId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'blocked'),
    allowNull: false,
    defaultValue: 'pending'
  },
  initiator: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  }
}, { sequelize });

class Game extends Model { }
Game.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  host: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('lobby', 'ongoing', 'complete'),
    allowNull: false,
    defaultValue: 'lobby'
  },
  timeConstraints: {
    type: DataTypes.STRING,
    allowNull: true
  },
  winnerId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: true
  }
}, { sequelize });

class Trophy extends Model { }
Trophy.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  generationConditions: DataTypes.TEXT, // This can be a stringified function or JSON
  filePath: DataTypes.STRING,
  ownerId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: true
  }
}, { sequelize, modelName: 'trophy' });

// Define the UserTrophy model for the join table
class UserTrophy extends Model { }
UserTrophy.init({
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  trophyId: {
    type: DataTypes.INTEGER,
    references: {
      model: Trophy,
      key: 'id',
    },
  },
  earnedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, { sequelize, modelName: 'userTrophy' });



// Define the associations
User.belongsToMany(Trophy, { through: UserTrophy });
Trophy.belongsToMany(User, { through: UserTrophy });

User.hasMany(Friends, { foreignKey: 'userId' });
Friends.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Friends, { foreignKey: 'friendId' });
Friends.belongsTo(User, { foreignKey: 'friendId' });

User.belongsTo(Game, { foreignKey: 'gameId' });
Game.hasMany(User, { foreignKey: 'gameId' });

export { User, Friends, Game, Trophy, UserTrophy };

/*** THE FOLLOWING EXISTS INCASE YOU NEED TO DROP INDIVIDUAL TABLES ***/
/*** JUST UNCOMMENT THE TABLE FROM THE LIST BELOW ***/
/*** THEN RECOMMENT IT SO YOU DON'T ACCIDENTALLY DELETE A TABLE YOU DONT WANT TO ***/

// async function dropTables(): Promise<void> {
//   try {
//     // Drop the tables in reverse order of their dependencies
//     await UserTrophy.drop();
//     await Trophy.drop();
//     await Friends.drop();
//     await Game.drop();
//     await User.drop();

//     console.log('Tables listed have been dropped.');
//   } catch (error) {
//     console.error('An error occurred while dropping the tables:', error);
//   }
// }

// dropTables();