export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4848/api"

// Adăugăm o funcție de debugging pentru a verifica configurația
console.log("API URL configured as:", API_URL)
if (process.env.NODE_ENV === "development") {
  console.log("API URL configured as:", API_URL)
}
