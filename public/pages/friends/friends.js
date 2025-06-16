document.addEventListener('DOMContentLoaded', () => {
    const friendsList = document.getElementById('friends');
    const requestsList = document.getElementById('requests');
    const searchInput = document.getElementById('search-username');
    const sendBtn = document.getElementById('send-request');
    const message = document.getElementById('search-message');
  
    async function fetchFriends() {
      const res = await fetch('/api/friends');
      const friends = await res.json();
      friendsList.innerHTML = friends.map(f => `<li>${f.username}</li>`).join('');
    }
  
    async function fetchRequests() {
      const res = await fetch('/api/friends/requests');
      const requests = await res.json();
      requestsList.innerHTML = requests.map(user => `
        <li>
          ${user.username}
          <button onclick="acceptRequest('${user.username}')">Accepter</button>
        </li>
      `).join('');
    }
  
    window.acceptRequest = async function(username) {
      const res = await fetch(`/api/friends/accept/${username}`, { method: 'POST' });
      const data = await res.json();
      alert(data.message);
      fetchRequests();
      fetchFriends();
    }
  
    sendBtn.addEventListener('click', async () => {
      const username = searchInput.value.trim();
      if (!username) return;
  
      const res = await fetch(`/api/friends/request/${username}`, { method: 'POST' });
      const data = await res.json();
      message.textContent = data.message || 'Ukendt svar';
      fetchRequests();
    });
  
    fetchFriends();
    fetchRequests();
});
  