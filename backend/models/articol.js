const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Articol extends Model {}
  Articol.init({
    id_articol:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titlu:        { type: DataTypes.STRING(255), allowNull: false },
    continut:     { type: DataTypes.TEXT, allowNull: false },
    id_categorie: { type: DataTypes.INTEGER, allowNull: false },
    creat_de:     { type: DataTypes.INTEGER, allowNull: false },
    data_crearii: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Articol',
    tableName: 'articol',
    timestamps: false
  });
  return Articol;
};

// const { DataTypes } = require("sequelize")
// const sequelize = require("../config/db")

// const Articol = sequelize.define(
//   "articol",
//   {
//     id_articol: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     titlu: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     continut: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     id_categorie: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     creat_de: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     data_crearii: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     underscored: true,
//     freezeTableName: true,
//   },
// )

// module.exports = Articol
