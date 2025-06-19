import { fetchTodos } from '../todo/todoFetch.js';

document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("today-todos");
  const userId = document.body.dataset.userId;

  try {
    const todos = await fetchTodos();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysTodos = todos.filter(todo => {
      const due = new Date(todo.dueDate);
      return due >= today && due <= endOfDay;
    });

    if (todaysTodos.length === 0) {
      list.innerHTML = `<li class="text-gray-500 italic">Ingen opgaver i dag</li>`;
    } else {
      list.innerHTML = "";

      todaysTodos.forEach(todo => {
        const time = new Date(todo.dueDate).toLocaleTimeString("da-DK", {
          hour: '2-digit',
          minute: '2-digit'
        });

        const isMine = typeof todo.user === "string"
          ? todo.user === userId
          : todo.user._id === userId;

        const titleColor = isMine ? "text-blue-600" : "text-purple-600";

        const li = document.createElement("li");
        li.className = "bg-gray-50 rounded p-3 border border-gray-200";

        let sharedText = "";
        if (!isMine && todo.user?.username) {
          sharedText = `Delt med dig af: ${todo.user.username}`;
        } else if (todo.sharedWith?.length > 0) {
          const others = todo.sharedWith.filter(u => u._id !== userId);
          if (others.length > 0) {
            sharedText = `Delt med: ${others.map(u => u.username).join(", ")}`;
          }
        }

        li.innerHTML = `
          <div class="flex justify-between items-center mb-1">
            <span class="font-medium ${titleColor}">${todo.title}</span>
            <span class="text-sm text-gray-500">${time}</span>
          </div>
          ${todo.comment ? `<p class="text-sm text-gray-700">${todo.comment}</p>` : ""}
          ${sharedText ? `<p class="text-xs text-purple-600 italic mt-1">${sharedText}</p>` : ""}
        `;

        list.appendChild(li);
      });
    }

  } catch (err) {
    console.error("Fejl ved hentning af dagens opgaver:", err);
    list.innerHTML = `<li class="text-red-500">Kunne ikke hente opgaver.</li>`;
  }
});
