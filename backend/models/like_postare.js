// const { DataTypes } = require("sequelize")
// const sequelize = require("../config/db")

// const LikePostare = sequelize.define(
//   "like_postare",
//   {
//     id_utilizator: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//     },
//     id_postare: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//     },
//   },
//   {
//     underscored: true,
//     freezeTableName: true,
//     timestamps: false,
//   },
// )

// module.exports = LikePostare
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class LikePostare extends Model {}
  LikePostare.init({
    id_like:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_postare:    { type: DataTypes.INTEGER, allowNull: false },
    id_utilizator: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'LikePostare',
    tableName: 'like_postare',
    timestamps: false
  });
  return LikePostare;
};