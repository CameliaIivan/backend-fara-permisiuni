// const { DataTypes } = require("sequelize")
// const sequelize = require("../config/db")

// const GrupUtilizator = sequelize.define(
//   "grup_utilizator",
//   {
//     id_utilizator: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//     },
//     id_grup: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//     },
//     rol_in_grup: {
//       type: DataTypes.STRING,
//     },
//     data_adaugare: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     underscored: true,
//     freezeTableName: true,
//     timestamps: false,
//   },
// )

// module.exports = GrupUtilizator
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class GrupUtilizator extends Model {}
  GrupUtilizator.init({
    id_grup:       { type: DataTypes.INTEGER, primaryKey: true },
    id_utilizator: { type: DataTypes.INTEGER, primaryKey: true },
    rol_in_grup:   { type: DataTypes.ENUM('member','admin'), defaultValue: 'member' },
    data_adaugare: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'GrupUtilizator',
    tableName: 'grup_utilizator',
    timestamps: false
  });
  return GrupUtilizator;
};