import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  shareTodo,
  fetchFriends
} from './todoFetch.js';

// DOM-elementer
const inputBox = document.getElementById("input-box");
const dateInput = document.getElementById("date-input");
const friendSelect = document.getElementById("friend-select");
const addButton = document.getElementById("add-button");
const listContainer = document.getElementById("todo-list-container");

// Fyld venne-dropdown
async function populateFriendDropdown() {
  try {
    const friends = await fetchFriends();
    friends.forEach(friend => {
      const option = document.createElement("option");
      option.value = friend._id;
      option.textContent = friend.username;
      friendSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Fejl ved hentning af venner:", error);
  }
}

// Opret todo-element i DOM
function createListItem(todo) {
  const li = document.createElement("li");
  li.dataset.id = todo._id;
  if (todo.completed) li.classList.add("checked");

  const wrapper = document.createElement("div");
  wrapper.classList.add("text-wrapper");

  const text = document.createElement("span");
  text.classList.add("todo-text");
  text.textContent = todo.title;

  const date = document.createElement("span");
  date.classList.add("todo-date");
  const formatted = new Date(todo.dueDate).toLocaleString("da-DK", {
    dateStyle: "short",
    timeStyle: "short"
  });
  date.textContent = formatted;

  wrapper.appendChild(text);
  wrapper.appendChild(date);
  li.appendChild(wrapper);

  if (todo.sharedWith?.length > 0) {
    const shared = document.createElement("div");
    shared.className = "shared-label";
    shared.textContent = "Delt med: " + todo.sharedWith.map(u => u.username).join(", ");
    li.appendChild(shared);
  }

  const deleteBtn = document.createElement("span");
  deleteBtn.classList.add("delete");
  deleteBtn.textContent = "×";
  li.appendChild(deleteBtn);

  listContainer.appendChild(li);
}

// Indlæs todos og vis i listen
async function loadTodos() {
  try {
    const todos = await fetchTodos();
    listContainer.innerHTML = "";
    todos.forEach(createListItem);
  } catch (error) {
    console.error("Fejl ved hentning af todos:", error);
    alert("Kunne ikke hente dine opgaver.");
  }
}

// Tilføj ny todo (og del hvis ven valgt)
async function addTask() {
  const title = inputBox.value.trim();
  const dueDate = dateInput.value;
  const friendId = friendSelect.value;

  if (title === "" || dueDate === "") {
    alert("Skriv både en opgave og vælg en dato og tidspunkt.");
    return;
  }

  try {
    const newTodo = await createTodo({
      title,
      dueDate: new Date(dueDate),
      completed: false
    });

    if (friendId) {
      await shareTodo(newTodo._id, friendId);
    }

    createListItem(newTodo);
    inputBox.value = "";
    dateInput.value = "";
    friendSelect.value = "";
  } catch (error) {
    console.error("Fejl ved oprettelse:", error);
    alert("Kunne ikke oprette opgaven.");
  }
}

// Klik-håndtering
listContainer.addEventListener("click", async (e) => {
  const li = e.target.closest("li");
  const id = li?.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("delete")) {
    try {
      await deleteTodo(id);
      li.remove();
    } catch (error) {
      console.error("Fejl ved sletning:", error);
    }
    return;
  }

  if (e.target.classList.contains("todo-text")) {
    const currentText = e.target.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.className = "edit-input";

    e.target.replaceWith(input);
    input.focus();

    input.addEventListener("blur", async () => {
      const newText = input.value.trim() || currentText;
      try {
        await updateTodo(id, { title: newText });
        const newSpan = document.createElement("span");
        newSpan.classList.add("todo-text");
        newSpan.textContent = newText;
        input.replaceWith(newSpan);
      } catch (error) {
        console.error("Fejl ved opdatering:", error);
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });

    return;
  }

  if (e.target === li) {
    const isCompleted = !li.classList.contains("checked");
    try {
      await updateTodo(id, { completed: isCompleted });
      li.classList.toggle("checked");
    } catch (error) {
      console.error("Fejl ved toggle:", error);
    }
  }
});

// Event listeners
addButton.addEventListener("click", addTask);
inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// Initial indlæsning
document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  populateFriendDropdown();
});
