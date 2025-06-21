
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Eveniment extends Model {}
  Eveniment.init({
    id_eveniment:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_postare:            { type: DataTypes.INTEGER, allowNull: false },
    data_eveniment:        { type: DataTypes.DATE, allowNull: false },
    locatie:               { type: DataTypes.STRING(255) },
    nr_maxim_participanti: { type: DataTypes.INTEGER },
    alte_detalii:          { type: DataTypes.TEXT },
    aprobat:               { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    modelName: 'Eveniment',
    tableName: 'eveniment',
    timestamps: false
  });
  return Eveniment;
};