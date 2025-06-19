import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo
} from '../todo/todoFetch.js';

// Ny helper: Hent venner
async function fetchFriends() {
  const res = await fetch("/api/friends");
  if (!res.ok) throw new Error("Kunne ikke hente venner");
  return res.json();
}

document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");
  const modal = document.getElementById("calendar-modal");
  const titleInput = document.getElementById("modal-title");
  const dateInput = document.getElementById("modal-date");
  const commentInput = document.getElementById("modal-comment");
  const saveBtn = document.getElementById("modal-save");
  const deleteBtn = document.getElementById("modal-delete");
  const closeBtn = document.getElementById("modal-close");
  const sharedLabel = document.getElementById("modal-shared-label");
  const friendSelect = document.getElementById("calendar-filter");

  let currentEvent = null;
  const userId = document.body.dataset.userId;

  try {
    const [todos, friends] = await Promise.all([fetchTodos(), fetchFriends()]);

    // Fyld venne-dropdown
    friends.forEach(friend => {
      const opt = document.createElement("option");
      opt.value = friend._id;
      opt.textContent = friend.username;
      friendSelect.appendChild(opt);
    });

    function renderCalendar(selectedFriendId = "") {
      const filteredEvents = todos.filter(todo => {
        const todoUserId = typeof todo.user === "string" ? todo.user : todo.user._id;
        const isMine = todoUserId === userId;
        const isFriends = selectedFriendId && todoUserId === selectedFriendId;
        const isSharedWithMe = todo.sharedWith?.includes(userId);
        const isSharedWithFriend = todo.sharedWith?.includes(selectedFriendId);

        if (!selectedFriendId) {
          return isMine || isSharedWithMe;
        }

        return isMine || isFriends || isSharedWithMe || isSharedWithFriend;
      });

      const events = filteredEvents.map(todo => {
        const todoUserId = typeof todo.user === "string" ? todo.user : todo.user._id;
        const isMine = todoUserId === userId;
        const isShared = todo.sharedWith?.length > 0;
        const isBlue = isMine && !isShared;

        return {
          id: todo._id,
          title: todo.title,
          start: todo.dueDate,
          allDay: false,
          backgroundColor: isBlue ? '#3b82f6' : '#9333ea',
          borderColor: isBlue ? '#2563eb' : '#7e22ce',
          textColor: '#fff',
          extendedProps: {
            completed: todo.completed,
            sharedWith: todo.sharedWith,
            comment: todo.comment || ""
          }
        };
      });

      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,listWeek",
        },
        editable: true,
        selectable: true,
        events: events,

        eventClick: function(info) {
          currentEvent = info.event;

          titleInput.value = currentEvent.title;
          dateInput.value = new Date(currentEvent.start).toISOString().slice(0, 16);
          commentInput.value = currentEvent.extendedProps.comment || "";
          deleteBtn.style.display = "inline-block";

          const sharedWith = currentEvent.extendedProps.sharedWith;
          if (sharedWith && sharedWith.length > 0) {
            sharedLabel.textContent = "Delt med: " + sharedWith.map(u => u.username).join(", ");
          } else {
            sharedLabel.textContent = "";
          }

          modal.classList.remove("hidden");
        },

        eventDrop: async function(info) {
          try {
            await updateTodo(info.event.id, { dueDate: info.event.start });
          } catch (err) {
            console.error("Fejl ved flytning:", err);
            info.revert();
          }
        },

        dateClick: function(info) {
          currentEvent = null;
          titleInput.value = "";
          dateInput.value = new Date(info.date).toISOString().slice(0, 16);
          commentInput.value = "";
          sharedLabel.textContent = "";
          deleteBtn.style.display = "none";

          modal.classList.remove("hidden");
        }
      });

      calendar.render();
      calendar.updateSize();
    }

    // Init
    renderCalendar();

    friendSelect.addEventListener("change", () => {
      calendarEl.innerHTML = "";
      renderCalendar(friendSelect.value);
    });

    document.querySelector(".fc-today-button")?.addEventListener("click", () => {
      calendar.today();
      calendar.updateSize();
    });

    modal.onclick = function (e) {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    };

    closeBtn?.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    saveBtn.onclick = async () => {
      const title = titleInput.value.trim();
      const dueDate = dateInput.value;
      const comment = commentInput.value.trim();

      if (!title || !dueDate) {
        alert("Titel og dato er påkrævet.");
        return;
      }

      try {
        if (currentEvent) {
          await updateTodo(currentEvent.id, { title, dueDate, comment });
        } else {
          await createTodo({ title, dueDate, comment, completed: false });
        }

        modal.classList.add("hidden");
        location.reload();
      } catch (err) {
        console.error("Fejl ved gem:", err);
      }
    };

    deleteBtn.onclick = async () => {
      if (!currentEvent) return;

      try {
        await deleteTodo(currentEvent.id);
        modal.classList.add("hidden");
        location.reload();
      } catch (err) {
        console.error("Fejl ved sletning:", err);
      }
    };

  } catch (err) {
    console.error("Fejl ved indlæsning af kalender eller venner:", err);
    calendarEl.innerHTML = "<p>Kunne ikke indlæse kalender.</p>";
  }
});
