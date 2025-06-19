import {
  getFriends,
  getRequests,
  sendRequest,
  acceptRequest,
  searchUsers,
  removeFriend
} from './friendsFetch.js';

document.addEventListener('DOMContentLoaded', () => {
  const friendsList = document.getElementById('friends');
  const requestsList = document.getElementById('requests');
  const searchInput = document.getElementById('search-username');
  const sendBtn = document.getElementById('send-request');
  const message = document.getElementById('search-message');
  const suggestions = document.getElementById('suggestions');

  // Vis venner
  async function renderFriends() {
    try {
      const friends = await getFriends();
      friendsList.innerHTML = friends.map(friend => `
        <li class="flex items-center justify-between border border-gray-200 rounded px-3 py-2">
          <span>${friend.username}</span>
          <button class="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            data-remove="${friend.username}">
            Fjern
          </button>
        </li>
      `).join('');
    } catch (err) {
      console.error("Fejl ved visning af venner:", err);
    }
  }

  // Vis venneanmodninger
  async function renderRequests() {
    try {
      const requests = await getRequests();
      requestsList.innerHTML = requests.map(user => `
        <li class="flex items-center justify-between border border-gray-200 rounded px-3 py-2">
          <span>${user.username}</span>
          <button class="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            data-username="${user.username}">
            Accepter
          </button>
        </li>
      `).join('');
    } catch (err) {
      console.error("Fejl ved visning af anmodninger:", err);
    }
  }

  // Acceptér venneanmodning
  requestsList.addEventListener("click", async (e) => {
    const username = e.target.dataset.username;
    if (username) {
      try {
        const data = await acceptRequest(username);
        alert(data.message);
        renderRequests();
        renderFriends();
      } catch (err) {
        console.error("Fejl ved accept:", err);
      }
    }
  });

  // Fjern ven
  friendsList.addEventListener("click", async (e) => {
    const username = e.target.dataset.remove;
    if (username) {
      const confirmed = confirm(`Er du sikker på, at du vil fjerne ${username} som ven?`);
      if (!confirmed) return;

      try {
        const result = await removeFriend(username);
        alert(result.message);
        renderFriends();
      } catch (err) {
        console.error("Fejl ved fjernelse af ven:", err);
      }
    }
  });

  // Send anmodning
  sendBtn.addEventListener('click', async () => {
    const username = searchInput.value.trim();
    if (!username) return;

    try {
      const data = await sendRequest(username);
      message.textContent = data.message || 'Ukendt svar';
      suggestions.classList.add("hidden");
      renderRequests();
    } catch (err) {
      console.error("Fejl ved anmodning:", err);
      message.textContent = err.message || "Noget gik galt";
    }
  });

  // Live søgning
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (!query) {
      suggestions.innerHTML = "";
      suggestions.classList.add("hidden");
      return;
    }

    try {
      const users = await searchUsers(query);

      if (users.length > 0) {
        suggestions.innerHTML = users.map(user => `
          <li class="px-3 py-2 hover:bg-gray-100 cursor-pointer" data-username="${user.username}">
            ${user.username}
          </li>
        `).join('');
        suggestions.classList.remove("hidden");
      } else {
        suggestions.innerHTML = "<li class='px-3 py-2 text-gray-500'>Ingen resultater</li>";
        suggestions.classList.remove("hidden");
      }
    } catch (err) {
      console.error("Fejl ved søgning:", err);
    }
  });

  // Vælg forslag
  suggestions.addEventListener("click", (e) => {
    if (e.target.dataset.username) {
      searchInput.value = e.target.dataset.username;
      suggestions.classList.add("hidden");
    }
  });

  // Init
  renderFriends();
  renderRequests();
});
