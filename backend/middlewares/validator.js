const Joi = require("joi")

/**
 * Middleware pentru validarea datelor de intrare folosind Joi
 * @param {Joi.Schema} schema - Schema Joi pentru validare
 * @param {string} property - Proprietatea din request care trebuie validată (body, params, query)
 * @returns {function} Middleware Express
 */
const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false })

    if (!error) {
      return next()
    }

    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }))

    return res.status(400).json({
      error: "Validation error",
      details: errors,
    })
  }
}

// Scheme de validare comune
const schemas = {
  // Autentificare
  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Adresa de email nu este validă",
      "string.empty": "Email-ul este obligatoriu",
      "any.required": "Email-ul este obligatoriu",
    }),
    parola: Joi.string().min(1).required().messages({
      "string.min": "Parola trebuie să aibă cel puțin {#limit} caractere",
      "string.empty": "Parola este obligatorie",
      "any.required": "Parola este obligatorie",
    }),
  }),

  // Înregistrare
  register: Joi.object({
    nume: Joi.string().min(2).max(100).required().messages({
      "string.min": "Numele trebuie să aibă cel puțin {#limit} caractere",
      "string.max": "Numele nu poate depăși {#limit} caractere",
      "string.empty": "Numele este obligatoriu",
      "any.required": "Numele este obligatoriu",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Adresa de email nu este validă",
      "string.empty": "Email-ul este obligatoriu",
      "any.required": "Email-ul este obligatoriu",
    }),
    parola: Joi.string().min(6).required().messages({
      "string.min": "Parola trebuie să aibă cel puțin {#limit} caractere",
      "string.empty": "Parola este obligatorie",
      "any.required": "Parola este obligatorie",
    }),
    //rol: Joi.string().valid("basic", "premium", "admin").default("basic"),
  }),

  // Schimbare parolă
  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      "string.empty": "Parola curentă este obligatorie",
      "any.required": "Parola curentă este obligatorie",
    }),
    newPassword: Joi.string().min(6).required().messages({
      "string.min": "Noua parolă trebuie să aibă cel puțin {#limit} caractere",
      "string.empty": "Noua parolă este obligatorie",
      "any.required": "Noua parolă este obligatorie",
    }),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
      "any.only": "Parolele nu coincid",
      "string.empty": "Confirmarea parolei este obligatorie",
      "any.required": "Confirmarea parolei este obligatorie",
    }),
  }),

  // Articol
  article: Joi.object({
    titlu: Joi.string().min(5).max(200).required().messages({
      "string.min": "Titlul trebuie să aibă cel puțin {#limit} caractere",
      "string.max": "Titlul nu poate depăși {#limit} caractere",
      "string.empty": "Titlul este obligatoriu",
      "any.required": "Titlul este obligatoriu",
    }),
    continut: Joi.string().min(10).required().messages({
      "string.min": "Conținutul trebuie să aibă cel puțin {#limit} caractere",
      "string.empty": "Conținutul este obligatoriu",
      "any.required": "Conținutul este obligatoriu",
    }),
    id_categorie: Joi.number().integer().allow(null),
  }),

  // Comentariu
  comment: Joi.object({
    id_postare: Joi.number().integer().required().messages({
      "number.base": "ID-ul postării trebuie să fie un număr",
      "any.required": "ID-ul postării este obligatoriu",
    }),
    continut: Joi.string().min(1).required().messages({
      "string.min": "Conținutul trebuie să aibă cel puțin {#limit} caractere",
      "string.empty": "Conținutul este obligatoriu",
      "any.required": "Conținutul este obligatoriu",
    }),
  }),

  // Eveniment
  event: Joi.object({
    titlu: Joi.string().min(5).max(200).required().messages({
      "string.min": "Titlul trebuie să aibă cel puțin {#limit} caractere",
      "string.max": "Titlul nu poate depăși {#limit} caractere",
      "string.empty": "Titlul este obligatoriu",
      "any.required": "Titlul este obligatoriu",
    }),
    continut: Joi.string().min(10).required().messages({
      "string.min": "Descrierea trebuie să aibă cel puțin {#limit} caractere",
      "string.empty": "Descrierea este obligatorie",
      "any.required": "Descrierea este obligatorie",
    }),
    data_eveniment: Joi.date().greater("now").required().messages({
      "date.greater": "Data evenimentului trebuie să fie în viitor",
      "any.required": "Data evenimentului este obligatorie",
    }),
    locatie: Joi.string().required().messages({
      "string.empty": "Locația este obligatorie",
      "any.required": "Locația este obligatorie",
    }),
    nr_maxim_participanti: Joi.number().integer().min(1).allow(null),
    alte_detalii: Joi.string().allow("", null),
    id_grup: Joi.number().integer().allow(null),
  }),
}

module.exports = {
  validate,
  schemas,
}
