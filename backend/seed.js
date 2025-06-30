const fs = require('fs');
const path = require('path');
const sequelize = require('./config/db');
const { User, CategorieArticol, Specializare } = require('./models');

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // recreează tabelele

  // 1) Crează useri
  await User.create({
    nume: 'Administrator',
    email: 'admin@exemplu.com',
    parola_hash: await require('bcrypt').hash('password123', 10),
    rol: 'admin',
  });
    await User.create({
    nume: 'User Basic',
    email: 'basic@exemplu.com',
    parola_hash: await require('bcrypt').hash('password123', 10),
    rol: 'basic',
  });
    await User.create({
    nume: 'User Premium',
    email: 'premium@exemplu.com',
    parola_hash: await require('bcrypt').hash('password123', 10),
    rol: 'premium',
  });

  // 2) Câteva categorii de articole
  await CategorieArticol.bulkCreate([
    { nume: 'Legislație' },
    { nume: 'Ghiduri' },
  ]);

  // 3) Specializări pentru spitale
  const specializariPath = path.join(__dirname, 'data', 'specializari.json');
  const specializari = JSON.parse(fs.readFileSync(specializariPath, 'utf8'));
  await Specializare.bulkCreate(
    specializari.map((nume) => ({ nume_specializare: nume }))
  );

  console.log('🌱 Seed complete');
  process.exit(0);
}
seed().catch(err => {
  console.error(err);
  process.exit(1);
});
