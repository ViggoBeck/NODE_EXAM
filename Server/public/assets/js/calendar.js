import { fetchTodos, updateTodo, deleteTodo } from './fetch/todoApi.js';

document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");

  try {
    const todos = await fetchTodos();

    const events = todos.map(todo => ({
      id: todo._id,
      title: todo.title,
      start: todo.dueDate,
      allDay: false,
      extendedProps: {
        completed: todo.completed
      }
    }));

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listWeek",
      },
      events: events,

      eventClick: function(info) {
        const modal = document.getElementById("calendar-modal");
        const titleInput = document.getElementById("modal-title");
        const dateInput = document.getElementById("modal-date");
        const saveBtn = document.getElementById("modal-save");
        const deleteBtn = document.getElementById("modal-delete");

        const event = info.event;
        const id = event.id;

        titleInput.value = event.title;
        dateInput.value = new Date(event.start).toISOString().slice(0, 16);

        // Vis modal
        modal.classList.remove("hidden");

        // Gem ændringer
        saveBtn.onclick = async () => {
          const updatedTitle = titleInput.value;
          const updatedDate = dateInput.value;

          try {
            await updateTodo(id, { title: updatedTitle, dueDate: updatedDate });
            modal.classList.add("hidden");
            location.reload();
          } catch (err) {
            console.error("Fejl ved opdatering:", err);
          }
        };

        // Slet opgave
        deleteBtn.onclick = async () => {
          try {
            await deleteTodo(id);
            modal.classList.add("hidden");
            location.reload();
          } catch (err) {
            console.error("Fejl ved sletning:", err);
          }
        };

        // Luk ved klik udenfor modal-indhold
        modal.onclick = function (e) {
          if (e.target === modal) {
            modal.classList.add("hidden");
          }
        };
      }
    });

    calendar.render();
  } catch (err) {
    console.error("Fejl ved hentning af opgaver til kalender:", err);
    calendarEl.innerHTML = "<p>Kunne ikke indlæse kalenderdata</p>";
  }

  // Ekstra luk-knap hvis du tilføjer den i HTML
  const closeBtn = document.getElementById("modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.getElementById("calendar-modal").classList.add("hidden");
    });
  }
});
