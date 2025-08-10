function showAddNewTaskModal() {
  const modal = document.querySelector(".add-new-task-button");
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function hideAddNewTaskModal() {
  const modal = document.querySelector(".add-new-task-modal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// DOM Elements
const body = document.body;
const todoLists = document.querySelectorAll(".todo-list");
const addTaskForm = document.getElementById("add-task-form");
const taskTitle = document.getElementById("task-title");
const taskDate = document.getElementById("task-date");
const modal = document.querySelector(".add-new-task-modal");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Initialize the app
function init() {
  renderAllTasks();
}

// Show/hide modal functions
function showAddNewTaskModal() {
  modal.style.display = "block";
  body.style.overflow = "hidden";
  addTaskForm.reset();
  const today = new Date().toISOString().split("T")[0];
  console.log(today)
  taskDate.value = today;
}

function hideAddNewTaskModal() {
  modal.style.display = "none";
  body.style.overflow = "auto";
}

// Add new task
addTaskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const newTask = {
    id: Date.now(),
    title: taskTitle.value,
    date: taskDate.value,
    category: document.getElementById("category").value,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks();
  renderAllTasks();
  hideAddNewTaskModal();
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render all tasks in their appropriate sections
function renderAllTasks() {
  todoLists.forEach((list) => (list.innerHTML = ""));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);

    if (task.completed) {
      document
        .querySelector(".todo-section:nth-child(4) .todo-list")
        .appendChild(taskElement);
    } else if (taskDate < today) {
      document
        .querySelector(".todo-section:nth-child(1) .todo-list")
        .appendChild(taskElement);
    } else if (taskDate.getTime() === today.getTime()) {
      document
        .querySelector(".todo-section:nth-child(2) .todo-list")
        .appendChild(taskElement);
    } else {
      document
        .querySelector(".todo-section:nth-child(3) .todo-list")
        .appendChild(taskElement);
    }
  });

  // Count tasks in each section
  const sectionNames = ["Overdue", "Due Today", "Upcoming", "Completed"];
  document.querySelectorAll(".todo-section").forEach((section, index) => {
    const count = section.querySelectorAll(".task").length;
    const todoTitle = section.querySelector(".todo-section-title");
    todoTitle.textContent = `${sectionNames[index]} - ${count}`;
  });
}

// Create task element
function createTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.className = `task ${task.category}`;
  taskElement.dataset.id = task.id;

  const title = document.createElement("p");
  title.className = "task-title";
  title.textContent = task.title;

  if (task.completed) {
    taskElement.classList.add("completed");
  }

  const date = document.createElement("p");
  date.className = "task-date";
  date.textContent = formatDate(task.date);

  const category = document.createElement("p");
  category.className = "task-category";
  category.textContent = task.category;

  // Create checkbox for task completion
  const completeCheckbox = document.createElement("input");
  completeCheckbox.type = "checkbox";
  completeCheckbox.style.display = "none";
  completeCheckbox.id = task.id;
  completeCheckbox.checked = task.completed;
  completeCheckbox.addEventListener("change", () =>
    toggleTaskComplete(task.id)
  );

  const completeLabel = document.createElement("label");
  completeLabel.className = "task-label";
  completeLabel.style.cursor = "pointer";
  completeLabel.htmlFor = completeCheckbox.id;

  const completeToggler = document.createElement("i");
  completeToggler.className = "fa-solid fa-check";

  completeLabel.appendChild(completeToggler);
  completeLabel.appendChild(completeCheckbox);

  // Create button for task deletion
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-task";
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  });

  // Append all elements to the task element
  taskElement.appendChild(title);
  taskElement.appendChild(date);
  taskElement.appendChild(category);
  taskElement.appendChild(completeLabel);
  taskElement.appendChild(deleteBtn);

  return taskElement;
}

// Toggle task complete status
function toggleTaskComplete(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderAllTasks();
}

// Delete task
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderAllTasks();
}

// Format date for display
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
