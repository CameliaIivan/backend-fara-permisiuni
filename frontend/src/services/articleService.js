// import api from "./api";

// export const getArticles = async (params) => {
//   // Returnează date de test
//   return [
//     {
//       id_articol: 1,
//       titlu: "Articol de test 1",
//       continut: "Conținut de test pentru articol 1",
//       data_crearii: new Date().toISOString()
//     },
//     {
//       id_articol: 2,
//       titlu: "Articol de test 2",
//       continut: "Conținut de test pentru articol 2",
//       data_crearii: new Date().toISOString()
//     }
//   ];
// };

// export const getArticleById = async (id) => {
//   // Returnează date de test
//   return {
//     id_articol: id,
//     titlu: "Articol de test",
//     continut: "Conținut de test pentru articol",
//     data_crearii: new Date().toISOString()
//   };
// };


import api from "./api"

export const getArticles = async (params) => {
  const response = await api.get("/articole/getAll", { params })
  return response.data
}

export const getArticleById = async (id) => {
  const response = await api.get(`/articole/${id}`)
  return response.data
}

export const getArticleCategories = async () => {
  const response = await api.get("/categorie_articole/getAll")
  return response.data
}

export const createArticle = async (articleData) => {
  const response = await api.post("/articole/create", articleData)
  return response.data
}

export const updateArticle = async (id, articleData) => {
  const response = await api.put(`/articole/update/${id}`, articleData)
  return response.data
}

export const deleteArticle = async (id) => {
  const response = await api.delete(`/articole/delete/${id}`)
  return response.data
}
