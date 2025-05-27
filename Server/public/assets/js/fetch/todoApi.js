const API_BASE_URL = '/api/todos';

export async function fetchTodos() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error('Kunne ikke hente todos');
  return response.json();
}

export async function createTodo(todo) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  });
  if (!response.ok) throw new Error('Kunne ikke oprette todo');
  return response.json();
}

export async function updateTodo(id, updates) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error('Kunne ikke opdatere todo');
  return response.json();
}

export async function deleteTodo(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Kunne ikke slette todo');
  return response.json();
}
