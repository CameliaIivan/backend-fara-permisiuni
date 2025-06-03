// const { DataTypes } = require("sequelize")
// const sequelize = require("../config/db")

// const Notificare = sequelize.define(
//   "notificare",
//   {
//     id_notificare: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     id_utilizator: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     continut: {
//       type: DataTypes.TEXT,
//     },
//     este_citita: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     data: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     underscored: true,
//     freezeTableName: true,
//   },
// )

// module.exports = Notificare
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Notificare extends Model {}
  Notificare.init({
    id_notificare: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_utilizator: { type: DataTypes.INTEGER, allowNull: false },
    continut:      { type: DataTypes.TEXT, allowNull: false },
    este_citita:   { type: DataTypes.BOOLEAN, defaultValue: false },
    data:          { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Notificare',
    tableName: 'notificare',
    timestamps: false
  });
  return Notificare;
};