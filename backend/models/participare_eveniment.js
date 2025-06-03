// const { DataTypes } = require("sequelize")
// const sequelize = require("../config/db")

// const ParticipareEveniment = sequelize.define(
//   "participare_eveniment",
//   {
//     id_utilizator: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//     },
//     id_eveniment: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//     },
//     data_inscriere: {
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

// module.exports = ParticipareEveniment
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ParticipareEveniment extends Model {}
  ParticipareEveniment.init({
    id_eveniment:   { type: DataTypes.INTEGER, primaryKey: true },
    id_utilizator:  { type: DataTypes.INTEGER, primaryKey: true },
    data_inscriere: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'ParticipareEveniment',
    tableName: 'participare_eveniment',
    timestamps: false
  });
  return ParticipareEveniment;
};