const API_BASE_URL = 'http://localhost:8080';

// LOGIN
export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include'
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

// FÆLLES GET (med session)
export async function fetchGet(url) {
  const res = await fetch(url, {
    credentials: 'include'
  });
  return await res.json();
}

// FÆLLES POST (med session)
export async function fetchPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });
  return await res.json();
}
