// const { DataTypes } = require("sequelize")
// const sequelize = require("../config/db")

// const Mesaj = sequelize.define(
//   "mesaj",
//   {
//     id_mesaj: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     id_conversatie: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     id_expeditor: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     continut: {
//       type: DataTypes.TEXT,
//     },
//     data_trimitere: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     underscored: true,
//     freezeTableName: true,
//   },
// )

// module.exports = Mesaj
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Mesaj extends Model {}
  Mesaj.init({
    id_mesaj:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_conversatie: { type: DataTypes.INTEGER, allowNull: false },
    id_expeditor:   { type: DataTypes.INTEGER, allowNull: false },
    continut:       { type: DataTypes.TEXT, allowNull: false },
    data_trimitere: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Mesaj',
    tableName: 'mesaj',
    timestamps: false
  });
  return Mesaj;
};