// const { DataTypes } = require("sequelize")
// const sequelize = require("../config/db")

// const Conversatie = sequelize.define(
//   "conversatie",
//   {
//     id_conversatie: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     id_utilizator_1: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     id_utilizator_2: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     data_start: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     underscored: true,
//     freezeTableName: true,
//   },
// )

// module.exports = Conversatie
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Conversatie extends Model {}
  Conversatie.init({
    id_conversatie:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_utilizator_1: { type: DataTypes.INTEGER, allowNull: false },
    id_utilizator_2: { type: DataTypes.INTEGER, allowNull: false },
    data_start:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Conversatie',
    tableName: 'conversatie',
    timestamps: false
  });
  return Conversatie;
};
