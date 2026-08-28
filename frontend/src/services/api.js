// Centralized API client. Every request in the app goes through here so
// the backend URL and auth header logic live in exactly one place.

const API_URL = import.meta.env.VITE_API_URL || 'https://quiz-maker-api-10cf.onrender.com/api/quizzes';

function getToken() {
  return sessionStorage.getItem('token');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error('Could not reach the server. Please check your connection and try again.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch (parseErr) {
    // No JSON body (e.g. some 500s) — fall through with data = null.
  }

  if (!response.ok) {
    const message = (data && data.message) || 'Something went wrong. Please try again.';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const authAPI = {
  register: (payload) => request('/users/register', { method: 'POST', body: payload }),
  login: (payload) => request('/users/login', { method: 'POST', body: payload }),
  getMe: () => request('/users/me', { auth: true }),
};

export const quizAPI = {
  getAll: (search) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/quizzes${query}`);
  },
  getById: (id) => request(`/quizzes/${id}`),
  create: (payload) => request('/quizzes', { method: 'POST', body: payload, auth: true }),
  update: (id, payload) => request(`/quizzes/${id}`, { method: 'PUT', body: payload, auth: true }),
  delete: (id) => request(`/quizzes/${id}`, { method: 'DELETE', auth: true }),
};

export const attemptAPI = {
  submit: (payload) => request('/attempts', { method: 'POST', body: payload, auth: true }),
  getMine: () => request('/attempts/my', { auth: true }),
  getById: (id) => request(`/attempts/${id}`, { auth: true }),
};

export { getToken };
