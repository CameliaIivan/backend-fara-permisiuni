// const { DataTypes } = require("sequelize")
// const sequelize = require("../config/db")

// const Comentariu = sequelize.define(
//   "comentariu",
//   {
//     id_comentariu: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     id_postare: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     id_utilizator: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     continut: {
//       type: DataTypes.TEXT,
//     },
//     data_comentariu: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     underscored: true,
//     freezeTableName: true,
//   },
// )

// module.exports = Comentariu
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Comentariu extends Model {}
  Comentariu.init({
    id_comentariu: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_postare:    { type: DataTypes.INTEGER, allowNull: false },
    id_utilizator: { type: DataTypes.INTEGER, allowNull: false },
    continut:      { type: DataTypes.TEXT, allowNull: false },
    data_comentariu:{ type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Comentariu',
    tableName: 'comentariu',
    timestamps: false
  });
  return Comentariu;
};