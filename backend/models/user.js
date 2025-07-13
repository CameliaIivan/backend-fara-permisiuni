// backend/models/user.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    id_utilizator: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nume:           { type: DataTypes.STRING(255), allowNull: false },
    email:          { type: DataTypes.STRING(255), allowNull: false, unique: true },
    parola_hash:    { type: DataTypes.STRING(255), allowNull: false },
    poza_profil:    { type: DataTypes.STRING(255) },
    rol:            { type: DataTypes.ENUM('basic','premium','admin'), defaultValue: 'basic' },
    stare_cont:     { type: DataTypes.ENUM('activ','suspendat'), defaultValue: 'activ' },
    data_crearii:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ultima_autentificare: { type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'utilizator',
    timestamps: false
  });
  return User;
};

// const { DataTypes } = require("sequelize")
// const sequelize = require("../config/db") // Asigură-te că ai configurat conexiunea în acest fișier

// const User = sequelize.define(
//   "utilizator",
//   {
//     id_utilizator: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     nume: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     parola_hash: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     rol: {
//       type: DataTypes.ENUM("basic", "premium", "admin"),
//       allowNull: false,
//     },
//     data_inregistrare: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     ultima_autentificare: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//     stare_cont: {
//       type: DataTypes.STRING,
//       defaultValue: "activ",
//     },
//   },
//   {
//     underscored: true,
//     freezeTableName: true,
//   },
// )

// module.exports = User
