import api from "./api"

export const getFaqs = async () => {
  const response = await api.get("/faq/getAll")
  return response.data
}

export const getFaqById = async (id) => {
  const response = await api.get(`/faq/${id}`)
  return response.data
}

export const createFaq = async (faqData) => {
  const response = await api.post("/faq/create", faqData)
  return response.data
}

export const updateFaq = async (id, faqData) => {
  const response = await api.put(`/faq/update/${id}`, faqData)
  return response.data
}

export const deleteFaq = async (id) => {
  const response = await api.delete(`/faq/delete/${id}`)
  return response.data
}
