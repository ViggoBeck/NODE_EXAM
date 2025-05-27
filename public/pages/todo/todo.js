import { fetchTodos, createTodo, updateTodo, deleteTodo } from './todoApi.js';

// DOM-elementer
const inputBox = document.getElementById("input-box");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const listContainer = document.getElementById("todo-list-container");

// Funktion til at oprette et enkelt todo-element i DOM'en
function createListItem(todo) {
    const li = document.createElement("li");
    li.dataset.id = todo._id;
    if (todo.completed) li.classList.add("checked");
  
    // Wrapper omkring teksten
    const textWrapper = document.createElement("div");
    textWrapper.classList.add("text-wrapper");
  
    // Titel
    const text = document.createElement("span");
    text.classList.add("todo-text");
    text.textContent = todo.title;
  
    // Dato og tid (formateret)
    const date = document.createElement("span");
    date.classList.add("todo-date");
    const formatted = new Date(todo.dueDate).toLocaleString("da-DK", {
      dateStyle: "short",
      timeStyle: "short"
    });
    date.textContent = formatted;
  
    textWrapper.appendChild(text);
    textWrapper.appendChild(date);
  
    // Slet-knap
    const deleteBtn = document.createElement("span");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = "×";
  
    li.appendChild(textWrapper);
    li.appendChild(deleteBtn);
    listContainer.appendChild(li);
}

// Henter alle todos fra API og viser dem i listen
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

// Tilføjer ny todo via API og viser den i listen
async function addTask() {
    const title = inputBox.value.trim();
    const dateInput = document.getElementById("date-input");
    const dueDate = dateInput.value;
  
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
  
      createListItem(newTodo);
      inputBox.value = "";
      dateInput.value = "";
    } catch (error) {
      console.error("Fejl ved oprettelse af todo:", error);
      alert("Kunne ikke oprette opgaven.");
    }
}
  
  
  

// Håndterer klik på todo-listen (toggle, slet, rediger)
listContainer.addEventListener("click", async (e) => {
  const li = e.target.closest("li");
  const id = li?.dataset.id;
  if (!id) return;

  // Klik på slet-knappen (×)
  if (e.target.classList.contains("delete")) {
    try {
      await deleteTodo(id);
      li.remove();
    } catch (error) {
      console.error("Fejl ved sletning:", error);
    }
    return;
  }

  // Klik på selve teksten → rediger todo
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
        console.error("Fejl ved opdatering af tekst:", error);
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });

    return;
  }

  //toggle "færdig"
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

// Event listeners til at tilføje en todo
addButton.addEventListener("click", addTask);
inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// Indlæs todos når siden loades
document.addEventListener("DOMContentLoaded", loadTodos);
