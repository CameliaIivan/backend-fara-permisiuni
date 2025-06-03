const sequelize = require('./config/db');
const { User, CategorieArticol, Specializare } = require('./models');

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // recreează tabelele

  // 1) Crează un admin
  await User.create({
    nume: 'Administrator',
    email: 'admin@exemplu.com',
    parola_hash: await require('bcrypt').hash('password123', 10),
    rol: 'admin',
  });

  // 2) Câteva categorii de articole
  await CategorieArticol.bulkCreate([
    { nume: 'Legislație' },
    { nume: 'Ghiduri' },
  ]);

  // 3) Specializări pentru spitale
  await Specializare.bulkCreate([
    { nume_specializare: 'Neurologie' },
    { nume_specializare: 'Cardiologie' },
  ]);

  console.log('🌱 Seed complete');
  process.exit(0);
}
seed().catch(err => {
  console.error(err);
  process.exit(1);
});
