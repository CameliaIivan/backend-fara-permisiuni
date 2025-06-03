const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SpitalSpecializare extends Model {}
  SpitalSpecializare.init({
    id_spital:       { type: DataTypes.INTEGER, primaryKey: true },
    id_specializare: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    sequelize,
    modelName: 'SpitalSpecializare',
    tableName: 'spital_specializare',
    timestamps: false
  });
  return SpitalSpecializare;
};