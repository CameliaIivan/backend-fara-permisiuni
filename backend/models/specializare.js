 const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Specializare extends Model {}
  Specializare.init({
    id_specializare:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nume_specializare: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    descriere:         { type: DataTypes.TEXT }
  }, {
    sequelize,
    modelName: 'Specializare',
    tableName: 'specializare',
    timestamps: false
  });
  return Specializare;
};