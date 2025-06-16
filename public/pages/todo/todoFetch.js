const API_BASE_URL = '/api/todos';

// Hent alle dine egne + delte todos
export async function fetchTodos() {
  const response = await fetch(API_BASE_URL, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Kunne ikke hente todos');
  return response.json();
}

// Opret ny todo
export async function createTodo(todo) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(todo)
  });
  if (!response.ok) throw new Error('Kunne ikke oprette todo');
  return response.json();
}

// Opdater eksisterende todo
export async function updateTodo(id, updates) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error('Kunne ikke opdatere todo');
  return response.json();
}

// Slet todo
export async function deleteTodo(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Kunne ikke slette todo');
  return response.json();
}

// Del todo med ven
export async function shareTodo(id, friendId) {
  const response = await fetch(`${API_BASE_URL}/${id}/share/${friendId}`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Kunne ikke dele todo');
  return response.json();
}

// Hent brugerens venner (til dropdown)
export async function fetchFriends() {
  const response = await fetch('/api/friends', {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Kunne ikke hente venner');
  return response.json();
}
