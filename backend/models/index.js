// backend/models/index.js
const sequelize = require('../config/db');
const { Model, DataTypes } = require('sequelize');

// Initializarea modelelor
const User                = require('./user')(sequelize);
const Articol             = require('./articol')(sequelize);
const CategorieArticol    = require('./categorie_articol')(sequelize);
const Spital              = require('./spital')(sequelize);
const Specializare        = require('./specializare')(sequelize);
const SpitalSpecializare  = require('./spital_specializare')(sequelize);
const Grup                = require('./grup')(sequelize);
const GrupUtilizator      = require('./grup_utilizator')(sequelize);
const Postare             = require('./postare')(sequelize);
const Eveniment           = require('./eveniment')(sequelize);
const ParticipareEveniment= require('./participare_eveniment')(sequelize);
const Comentariu          = require('./comentariu')(sequelize);
const Notificare          = require('./notificare')(sequelize);
const LikePostare         = require('./like_postare')(sequelize);
const Conversatie         = require('./conversatie')(sequelize);
const Mesaj               = require('./mesaj')(sequelize);
const Faq                 = require('./faq')(sequelize);

// Asociații între modele

Articol.belongsTo(CategorieArticol, { foreignKey: 'id_categorie' });
CategorieArticol.hasMany(Articol, { foreignKey: 'id_categorie' });

Articol.belongsTo(User, { foreignKey: 'creat_de' });
User.hasMany(Articol, { foreignKey: 'creat_de' });

Spital.belongsTo(User, { foreignKey: 'creat_de' });
User.hasMany(Spital, { foreignKey: 'creat_de' });

Spital.belongsToMany(Specializare, {
  through: SpitalSpecializare,
  foreignKey: 'id_spital',
  otherKey: 'id_specializare',
  as: 'specializari',
});
Specializare.belongsToMany(Spital, {
  through: SpitalSpecializare,
  foreignKey: 'id_specializare',
  otherKey: 'id_spital',
  as: 'spitale',
});

Grup.belongsTo(User, { foreignKey: 'creat_de', as: 'creator' });
User.hasMany(Grup, { foreignKey: 'creat_de' });
// Relația dintre Grup și utilizatorii săi (membri)
Grup.hasMany(GrupUtilizator, {
  foreignKey: 'id_grup',
  as: 'GrupUtilizatori',
});
GrupUtilizator.belongsTo(Grup, { foreignKey: 'id_grup' });

Grup.belongsToMany(User, { through: GrupUtilizator, foreignKey: 'id_grup' });
User.belongsToMany(Grup, { through: GrupUtilizator, foreignKey: 'id_utilizator' });
User.hasMany(GrupUtilizator, { foreignKey: 'id_utilizator' });
GrupUtilizator.belongsTo(User, { foreignKey: 'id_utilizator' });

Postare.belongsTo(User, { foreignKey: 'creat_de' });
User.hasMany(Postare, { foreignKey: 'creat_de' });
Postare.belongsTo(Grup, { foreignKey: 'id_grup' });
Grup.hasMany(Postare, { foreignKey: 'id_grup' });

Eveniment.belongsTo(Postare, { foreignKey: 'id_postare' });
Postare.hasOne(Eveniment, { foreignKey: 'id_postare' });

ParticipareEveniment.belongsTo(User, { foreignKey: 'id_utilizator' });
User.hasMany(ParticipareEveniment, { foreignKey: 'id_utilizator' });
ParticipareEveniment.belongsTo(Eveniment, { foreignKey: 'id_eveniment' });
Eveniment.hasMany(ParticipareEveniment, { foreignKey: 'id_eveniment' });

Comentariu.belongsTo(Postare, { foreignKey: 'id_postare' });
Postare.hasMany(Comentariu, { foreignKey: 'id_postare' });
Comentariu.belongsTo(User, { foreignKey: 'id_utilizator' });
User.hasMany(Comentariu, { foreignKey: 'id_utilizator' });

Notificare.belongsTo(User, { foreignKey: 'id_utilizator' });
User.hasMany(Notificare, { foreignKey: 'id_utilizator' });
Notificare.belongsTo(Eveniment, { foreignKey: 'id_eveniment' });
Eveniment.hasMany(Notificare, { foreignKey: 'id_eveniment' });

LikePostare.belongsTo(User, { foreignKey: 'id_utilizator' });
User.hasMany(LikePostare, { foreignKey: 'id_utilizator' });
LikePostare.belongsTo(Postare, { foreignKey: 'id_postare' });
Postare.hasMany(LikePostare, { foreignKey: 'id_postare' });

Conversatie.belongsTo(User, { as: 'User1', foreignKey: 'id_utilizator_1' });
Conversatie.belongsTo(User, { as: 'User2', foreignKey: 'id_utilizator_2' });
User.hasMany(Conversatie, { as: 'ConversatiiUser1', foreignKey: 'id_utilizator_1' });
User.hasMany(Conversatie, { as: 'ConversatiiUser2', foreignKey: 'id_utilizator_2' });

Mesaj.belongsTo(Conversatie, { foreignKey: 'id_conversatie' });
Conversatie.hasMany(Mesaj, { foreignKey: 'id_conversatie' });
Mesaj.belongsTo(User, { foreignKey: 'id_expeditor' });
User.hasMany(Mesaj, { foreignKey: 'id_expeditor' });

Faq.belongsTo(User, { foreignKey: 'creat_de' });
User.hasMany(Faq, { foreignKey: 'creat_de' });

// Exportă instanța și modelele
module.exports = {
  sequelize,
  User,
  Articol,
  CategorieArticol,
  Spital,
  Specializare,
  SpitalSpecializare,
  Grup,
  GrupUtilizator,
  Postare,
  Eveniment,
  ParticipareEveniment,
  Comentariu,
  Notificare,
  LikePostare,
  Conversatie,
  Mesaj,
  Faq,
};
