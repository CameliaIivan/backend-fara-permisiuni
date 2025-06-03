/**
 * Middleware pentru adăugarea headerelor de securitate
 */
const securityHeaders = (req, res, next) => {
  // Previne încărcarea site-ului în iframe-uri (protecție împotriva clickjacking)
  res.setHeader("X-Frame-Options", "DENY")

  // Previne browser-ul să interpreteze fișiere ca altceva decât tipul lor declarat
  res.setHeader("X-Content-Type-Options", "nosniff")

  // Activează filtrul XSS în browsere
  res.setHeader("X-XSS-Protection", "1; mode=block")

  // Dezactivează cache pentru conținut sensibil
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
  res.setHeader("Pragma", "no-cache")
  res.setHeader("Expires", "0")

  // Previne expunerea informațiilor sensibile
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none")

  // Elimină fingerprinting-ul serverului
  res.setHeader("X-Powered-By", "")

  next()
}

/**
 * Middleware pentru limitarea ratei de cereri
 * Implementare simplă, pentru o soluție mai robustă folosește express-rate-limit
 */
const requestLimiter = () => {
  const requestCounts = {}
  const WINDOW_MS = 15 * 60 * 1000 // 15 minute
  const MAX_REQUESTS = 100 // 100 cereri per IP în fereastra de timp

  // Curăță contoarele periodic
  setInterval(() => {
    for (const ip in requestCounts) {
      if (Date.now() - requestCounts[ip].timestamp > WINDOW_MS) {
        delete requestCounts[ip]
      }
    }
  }, WINDOW_MS)

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress

    if (!requestCounts[ip]) {
      requestCounts[ip] = {
        count: 1,
        timestamp: Date.now(),
      }
      return next()
    }

    // Resetează contorul dacă a trecut fereastra de timp
    if (Date.now() - requestCounts[ip].timestamp > WINDOW_MS) {
      requestCounts[ip] = {
        count: 1,
        timestamp: Date.now(),
      }
      return next()
    }

    // Incrementează contorul și verifică limita
    requestCounts[ip].count++
    if (requestCounts[ip].count > MAX_REQUESTS) {
      return res.status(429).json({
        error: "Too many requests, please try again later.",
        retryAfter: Math.ceil((requestCounts[ip].timestamp + WINDOW_MS - Date.now()) / 1000),
      })
    }

    next()
  }
}

module.exports = {
  securityHeaders,
  requestLimiter,
}
