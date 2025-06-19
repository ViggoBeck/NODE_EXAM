import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  shareTodo,
  fetchFriends
} from './todoFetch.js';

const socket = window.io();
const userId = document.body.dataset.userId;
if (userId) {
  socket.emit("join", userId);
}

const inputBox = document.getElementById("input-box");
const dateInput = document.getElementById("date-input");
const friendSelect = document.getElementById("friend-select");
const addButton = document.getElementById("add-button");
const listContainer = document.getElementById("todo-list-container");

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

function createListItem(todo) {
  const li = document.createElement("li");
  li.dataset.id = todo._id;

  li.classList.add("transition-opacity", "duration-1000");
  if (todo.completed) li.classList.add("checked", "opacity-50", "italic");

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

  const sharedLabel = document.createElement("div");
  sharedLabel.className = "shared-label";

  if (todo.user && todo.user._id !== userId) {
    sharedLabel.textContent = `with: ${todo.user.username}`;
    li.appendChild(sharedLabel);
  } else if (todo.sharedWith?.length > 0) {
    const others = todo.sharedWith.filter(u => u._id !== userId);
    if (others.length > 0) {
      sharedLabel.textContent = "with: " + others.map(u => u.username).join(", ");
      li.appendChild(sharedLabel);
    }
  }

  const deleteBtn = document.createElement("span");
  deleteBtn.classList.add("delete");
  deleteBtn.textContent = "×";
  li.appendChild(deleteBtn);

  listContainer.appendChild(li);
}

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

    inputBox.value = "";
    dateInput.value = "";
    friendSelect.value = "";
  } catch (error) {
    console.error("Fejl ved oprettelse:", error);
    alert("Kunne ikke oprette opgaven.");
  }
}

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
    const isNowCompleted = !li.classList.contains("checked");

    try {
      await updateTodo(id, { completed: isNowCompleted });

      li.classList.toggle("checked");

      if (isNowCompleted) {
        li.classList.add("opacity-50", "italic");

        setTimeout(async () => {
          try {
            await deleteTodo(id);
            li.remove();
          } catch (err) {
            console.error("Fejl ved automatisk sletning:", err);
          }
        }, 1000);
      } else {
        li.classList.remove("opacity-50", "italic");
      }
    } catch (error) {
      console.error("Fejl ved toggling:", error);
    }
  }
});

addButton.addEventListener("click", addTask);
inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  populateFriendDropdown();
});

socket.on("new-todo", (todo) => {
  if (!document.querySelector(`li[data-id="${todo._id}"]`)) {
    createListItem(todo);
  }
});
