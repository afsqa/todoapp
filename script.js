document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");

  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => addTaskToDOM(task));

  let editTaskId = null; // Track which task is being edited

  // Add or update task
  todoForm.addEventListener("submit", event => {
    event.preventDefault();
    const taskText = todoInput.value.trim();

    if (taskText) {
      if (editTaskId) {
        updateTask(editTaskId, taskText);
        editTaskId = null; // Reset edit mode
      } else {
        const task = { id: Date.now(), text: taskText };
        addTaskToDOM(task);
        saveTask(task);
      }
      todoInput.value = ""; // Clear the input field
    }
  });

  // Add task to the DOM
  function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    li.appendChild(taskText);

    // Create Edit Button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => startEdit(task.id)); // Pass task ID instead of task object

    // Create Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => removeTask(task.id));

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  }

  // Save task to localStorage
  function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Start editing a task
  function startEdit(id) {
    // Fetch the most up-to-date version of the task from localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskToEdit = tasks.find(task => task.id === id);

    if (taskToEdit) {
      editTaskId = id; // Set the current task to edit mode
      todoInput.value = taskToEdit.text; // Pre-fill the input with the latest task text
      todoInput.focus();
    }
  }

  // Update task in localStorage and DOM
  function updateTask(id, newText) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].text = newText;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Update the task text in the DOM
    const li = document.querySelector(`li[data-id="${id}"]`);
    li.querySelector("span").textContent = newText;
  }

  // Remove task
  function removeTask(id) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    // Remove the task from the DOM
    document.querySelector(`li[data-id="${id}"]`).remove();
  }
});
