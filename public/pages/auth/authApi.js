const API_BASE_URL = '/api';

// LOGIN
export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include' // VIGTIGT for at sende cookies
  });
  return await res.json();
}

// SIGNUP
export async function signup(username, password, email) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
    credentials: 'include'
  });
  return await res.json();
}

// LOGOUT
export async function logout() {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  return await res.json();
}

