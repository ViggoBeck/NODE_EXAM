// Hent alle venner
export async function getFriends() {
    const res = await fetch('/api/friends', { credentials: 'include' });
    if (!res.ok) throw new Error("Kunne ikke hente venner");
    return res.json();
}
  
// Hent venneanmodninger
export async function getRequests() {
    const res = await fetch('/api/friends/requests', { credentials: 'include' });
    if (!res.ok) throw new Error("Kunne ikke hente venneanmodninger");
    return res.json();
}
  
// Send venneanmodning
export async function sendRequest(username) {
    const res = await fetch(`/api/friends/request/${username}`, {
      method: 'POST',
      credentials: 'include'
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Kunne ikke sende anmodning');
    }
  
    return res.json();
}
  
// Accepter venneanmodning
export async function acceptRequest(username) {
    const res = await fetch(`/api/friends/accept/${username}`, {
      method: 'POST',
      credentials: 'include'
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Kunne ikke acceptere anmodning');
    }
  
    return res.json();
}
  
// Live søgning efter brugere 
export async function searchUsers(query) {
    const res = await fetch(`/api/friends/search?query=${encodeURIComponent(query)}`, {
      credentials: 'include'
    });
  
    if (!res.ok) throw new Error("Fejl ved brugersøgning");
    return res.json();
}
// Fjern en ven
export async function removeFriend(username) {
    const res = await fetch(`/api/friends/${username}`, {
      method: 'DELETE',
      credentials: 'include'
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Fejl ved fjernelse af ven');
    }
  
    return res.json();
}
  