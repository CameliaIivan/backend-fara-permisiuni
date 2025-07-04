import api from "./api"

// Groups
export const getGroups = async () => {
  const response = await api.get("/grupuri/getAll")
  return response.data
}

export const getGroupById = async (id) => {
  const response = await api.get(`/grupuri/${id}`)
  return response.data
}

export const createGroup = async (groupData) => {
  const response = await api.post("/grupuri/create", groupData)
  return response.data
}

export const updateGroup = async (id, groupData) => {
  const response = await api.put(`/grupuri/update/${id}`, groupData)
  return response.data
}

export const deleteGroup = async (id) => {
  const response = await api.delete(`/grupuri/delete/${id}`)
  return response.data
}
export const getUserGroups = async (userId) => {
  const response = await api.get(`/grup_utilizator/userGroups/${userId}`)
  return response.data
}

export const joinGroup = async (groupId) => {
  const response = await api.post('/grup_utilizator/join', { id_grup: groupId })
  return response.data
}

export const leaveGroup = async (groupId, userId) => {
  const response = await api.delete('/grup_utilizator/remove', {
    data: { id_grup: groupId, id_utilizator: userId },
  })
  return response.data
}
// Posts
export const getPosts = async (params) => {
  const response = await api.get("/postari/getAll", { params })
  return response.data
}

export const getPostById = async (id) => {
  const response = await api.get(`/postari/${id}`)
  return response.data
}

export const createPost = async (postData) => {
  const response = await api.post("/postari/create", postData)
  return response.data
}

export const updatePost = async (id, postData) => {
  const response = await api.put(`/postari/update/${id}`, postData)
  return response.data
}

export const deletePost = async (id) => {
  const response = await api.delete(`/postari/delete/${id}`)
  return response.data
}

// Comments
export const getCommentsByPost = async (postId) => {
  const response = await api.get(`/comentarii/post/${postId}`)
  return response.data
}

export const createComment = async (commentData) => {
  const response = await api.post("/comentarii/create", commentData)
  return response.data
}

export const updateComment = async (id, commentData) => {
  const response = await api.put(`/comentarii/update/${id}`, commentData)
  return response.data
}

export const deleteComment = async (id) => {
  const response = await api.delete(`/comentarii/delete/${id}`)
  return response.data
}

// Likes
export const likePost = async (postId) => {
  const response = await api.post("/like_postari/create", { id_postare: postId })
  return response.data
}

export const unlikePost = async (postId) => {
  const response = await api.delete("/like_postari/delete", { data: { id_postare: postId } })
  return response.data
}

// Events
export const getEvents = async () => {
  const response = await api.get("/evenimente/getAll")
  return response.data
}

export const getEventById = async (id) => {
  const response = await api.get(`/evenimente/${id}`)
  return response.data
}

export const createEvent = async (eventData) => {
  const response = await api.post("/evenimente/create", eventData)
  return response.data
}

export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/evenimente/update/${id}`, eventData)
  return response.data
}

export const deleteEvent = async (id) => {
  const response = await api.delete(`/evenimente/delete/${id}`)
  return response.data
}

export const getPendingEvents = async () => {
  const response = await api.get('/evenimente/pending')
  return response.data
}

export const approveEvent = async (id) => {
   const response = await api.put(`/evenimente/approve/${id}`)
  return response.data
}

export const rejectEvent = async (id) => {
  const response = await api.put(`/evenimente/reject/${id}`)
  return response.data
}


export const joinEvent = async (eventId) => {
  const response = await api.post("/participare_evenimente/join", { id_eveniment: eventId })
  return response.data
}

export const leaveEvent = async (eventId) => {
  const response = await api.delete("/participare_evenimente/leave", { data: { id_eveniment: eventId } })
  return response.data
}

// Messages
export const getConversations = async () => {
  const response = await api.get("/conversatii/getAll")
  return response.data
}

export const getConversationById = async (id) => {
  const response = await api.get(`/conversatii/${id}`)
  return response.data
}

export const createConversation = async (userId) => {
  const response = await api.post("/conversatii/create", { id_destinatar: userId })
  return response.data
}
export const searchUsers = async (query) => {
  const response = await api.get(`/users/search`, { params: { q: query } })
  return response.data
}

export const getAdmins = async () => {
  const response = await api.get('/users/admins')
  return response.data
}

export const getMessagesByConversation = async (conversationId) => {
  const response = await api.get(`/mesaje/conversatie/${conversationId}`)
  return response.data
}

export const sendMessage = async (messageData) => {
  const response = await api.post("/mesaje/create", messageData)
  return response.data
}

// Notifications
export const getNotifications = async () => {
  const response = await api.get("/notificari/getAll")
  return response.data
}

export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/notificari/markAsRead/${id}`)
  return response.data
}

export const markAllNotificationsAsRead = async () => {
  const response = await api.put("/notificari/markAllAsRead")
  return response.data
}
