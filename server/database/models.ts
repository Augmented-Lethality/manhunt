import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

////////////////////////////////////////////////
class User extends Model {
  id!: number;
  username!: string;
  gamesPlayed!: number;
  gamesWon!: number;
  killsConfirmed!: number;
  facialDescriptions: any;
  largeFont!: boolean;
  friends!: Array<number>;
  sentRequests!: Array<number>;
  receivedRequests!: Array<number>;
}
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
    unique: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  facialDescriptions: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    allowNull: true
  },
  socketId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  gameId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',

  },
  tfModelPath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gamesPlayed: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  gamesWon: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  killsConfirmed: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  largeFont: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  friends: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
    defaultValue: []
  },
  sentRequests: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
    defaultValue: []
  },
  receivedRequests: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
    defaultValue: []
  }
}, { sequelize });

////////////////////////////////////////////////

class Locations extends Model { }
Locations.init({
  authId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  gameId: {
    type: DataTypes.STRING,
  },
  longitude: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
}, { sequelize });
///////////////////////////

class Game extends Model {
  gameId: any;
  users: any;
}
Game.init({
  gameId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  host: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'authId'
    },
    allowNull: false,
  },
  hostName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hunted: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  status: {
    type: DataTypes.ENUM('lobby', 'ongoing', 'complete'),
    allowNull: false,
    defaultValue: 'lobby'
  },
  timeConstraints: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  timeStart: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  winnerId: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'authId'
    },
    allowNull: true
  },
  users: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
}, { sequelize });

////////////////////////////////////////////////

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

export { User, Game, Trophy, UserTrophy, Locations };