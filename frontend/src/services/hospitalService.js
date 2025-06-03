import api from "./api"

export const getHospitals = async (params) => {
  const response = await api.get("/spitale/getAll", { params })
  return response.data
}

export const getHospitalById = async (id) => {
  const response = await api.get(`/spitale/${id}`)
  return response.data
}

export const getSpecializations = async () => {
  const response = await api.get("/specializari/getAll")
  return response.data
}

export const createHospital = async (hospitalData) => {
  const response = await api.post("/spitale/create", hospitalData)
  return response.data
}

export const updateHospital = async (id, hospitalData) => {
  const response = await api.put(`/spitale/update/${id}`, hospitalData)
  return response.data
}

export const deleteHospital = async (id) => {
  const response = await api.delete(`/spitale/delete/${id}`)
  return response.data
}
