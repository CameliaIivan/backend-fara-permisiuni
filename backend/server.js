// // Încarcă variabilele de mediu din fișierul .env
// require("dotenv").config()

// const express = require("express")
// const cors = require("cors")
// const path = require("path")
// const fs = require("fs")
// const morgan = require("morgan")
// const routes = require("./routes")
// const security = require("./middlewares/security")
// const sequelize = require('./config/db')



// // Inițializează aplicația Express
// const app = express()

// // sincronizează toate modelele (doar pentru development)
// sequelize.sync({ alter: true })
//   .then(() => console.log('✨ Sync OK'))
//   .catch(e => console.error('Sync ERR', e));

// // porneşte serverul după sync
// app.listen(PORT, () => console.log(`🚀 Server pe ${PORT}`));



// // Middleware pentru parsarea JSON și URL-encoded data
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// // Middleware de securitate
// app.use(security.securityHeaders)

// // Aplică limitarea ratei de cereri doar în producție
// if (process.env.NODE_ENV === "production") {
//   app.use(security.requestLimiter())
// }

// // Înlocuiește configurarea CORS existentă cu această implementare mai robustă
// // Configurare CORS
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Permite cereri fără origin (cum ar fi cele de la aplicații mobile sau Postman)
//       if (!origin) return callback(null, true)

//       const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []

//       if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
//         callback(null, true)
//       } else {
//         callback(new Error("CORS not allowed"))
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//     maxAge: 86400, // 24 ore în secunde
//   }),
// )

// // Creează directorul pentru uploads dacă nu există
// const uploadsDir = path.join(__dirname, "uploads")
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true })
// }

// // Servește fișierele statice din directorul uploads
// app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// // Logging middleware
// app.use(morgan("dev"))

// // Middleware pentru verificarea JWT_SECRET
// app.use((req, res, next) => {
//   if (!process.env.JWT_SECRET) {
//     console.warn("AVERTISMENT: JWT_SECRET nu este setat. Folosește o valoare implicită nesigură.")
//   }
//   next()
// })

// // Rutele API
// app.use("/api", routes)

// // Middleware pentru gestionarea erorilor
// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).json({
//     error: "A apărut o eroare internă a serverului",
//     message: process.env.NODE_ENV === "development" ? err.message : undefined,
//   })
// })

// // Middleware pentru rutele care nu există
// app.use((req, res) => {
//   res.status(404).json({ error: "Ruta nu a fost găsită" })
// })

// // Pornește serverul
// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log(`Serverul rulează pe portul ${PORT}`)
//   console.log(`API disponibil la http://localhost:${PORT}/api`)
// })

// // Gestionarea închiderii elegante a serverului
// process.on("SIGTERM", () => {
//   console.log("SIGTERM primit. Închidere server...")
//   process.exit(0)
// })

// process.on("SIGINT", () => {
//   console.log("SIGINT primit. Închidere server...")
//   process.exit(0)
// })


// Încarcă variabilele de mediu din .env
require("dotenv").config();

const express  = require("express");
const cors     = require("cors");
const path     = require("path");
const fs       = require("fs");
const morgan   = require("morgan");
const routes   = require("./routes");
const security = require("./middlewares/security");
const sequelize= require("./config/db");

// Citește PORT înainte de orice folosire
const PORT = process.env.PORT || 4848;

// Inițializează aplicația Express
const app = express();

// Middleware pentru parsarea JSON și URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Header-uri de securitate
app.use(security.securityHeaders);

// Rate limiter doar în producție
if (process.env.NODE_ENV === "production") {
  app.use(security.requestLimiter());
}

// Configurare CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : [];
      if (allowed.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  })
);

// Director uploads
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Logging
app.use(morgan("dev"));

// Warn dacă JWT_SECRET lipsește
app.use((req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.warn("⚠️ AVERTISMENT: JWT_SECRET nu este setat!");
  }
  next();
});

// Rutele API
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Ruta nu a fost găsită" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({
      error: "A apărut o eroare internă a serverului",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

// Conectare DB și pornire server
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ DB connection OK");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("✨ Sync OK — modelele sunt up to date");
    app.listen(PORT, () => {
      console.log(`🚀 Serverul rulează pe portul ${PORT}`);
      console.log(`📡 API disponibil la http://localhost:${PORT}/api`);
    });
  })
  .catch((e) => {
    console.error("❌ DB error:", e);
    process.exit(1);
  });

// Închidere elegantă
process.on("SIGTERM", () => {
  console.log("SIGTERM primit. Închidere server...");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("SIGINT primit. Închidere server...");
  process.exit(0);
});
