const fs = require('fs');
const path = require('path');
const sequelize = require('./config/db');
const { User, CategorieArticol, Specializare, Articol } = require('./models');
const https = require('https');

async function fetchInfoabilArticles() {
  const feedUrl = 'https://www.infoabil.ro/feed/';
  return new Promise((resolve, reject) => {
    https
      .get(feedUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const items = data.match(/<item>[\s\S]*?<\/item>/g) || [];
            const articles = items.map((item) => {
              const titleMatch = item.match(/<title>(.*?)<\/title>/);
              const contentMatch = item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
              return {
                titlu: titleMatch ? titleMatch[1] : 'Fără titlu',
                continut: contentMatch ? contentMatch[1] : '',
                id_categorie: 1, // implicit "Legislație"
                creat_de: 1,
              };
            });
            resolve(articles);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
} 

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
  
  // 4) Articole preluate de pe infoabil.ro
  try {
    const infoabilArticole = await fetchInfoabilArticles();
    if (infoabilArticole.length) {
      await Articol.bulkCreate(infoabilArticole);
    }
  } catch (e) {
    console.warn('Nu s-au putut prelua articolele infoabil:', e.message);
  }

  console.log('🌱 Seed complete');
  process.exit(0);
}
seed().catch(err => {
  console.error(err);
  process.exit(1);
});
