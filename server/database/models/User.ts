// import { Sequelize, DataTypes, Model } from 'sequelize';
// import { sequelize } from '../index'; // Assuming this is the path to your index file

// interface UserAttributes {
//   id?: number;
//   name: string;
//   email: string;
// }

// class User extends Model<UserAttributes> implements UserAttributes {
//   public id!: number;
//   public name!: string;
//   public email!: string;

//   // Other methods or static properties can be defined here

//   // You can also define class-level associations or methods here
// }

// User.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         isEmail: true,
//       },
//     },
//   },
//   {
//     sequelize,
//     tableName: 'users',
//     timestamps: false,
//   }
// );

// export { User };