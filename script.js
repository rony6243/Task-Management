const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".content-section");
const pageTitle = document.getElementById("pageTitle");

const menuBtn = document.getElementById("menuBtn");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");
const historyList = document.getElementById("historyList");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const formHeading = document.getElementById("formHeading");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const clearAllDataBtn = document.getElementById("clearAllDataBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [
  {
    id: Date.now() + 1,
    title: "Cricate Mach",
    date: "2026-03-20",
    priority: "High",
    completed: false
  },
  {
    id: Date.now() + 2,
    title: "Game Time",
    date: "2026-03-22",
    priority: "Medium",
    completed: false
  },
  {
    id: Date.now() + 3,
    title: "Movie times",
    date: "2026-03-25",
    priority: "Low",
    completed: true
  }
];

let editTaskId = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getPriorityClass(priority) {
  return priority.toLowerCase();
}

function renderStats() {
  totalTasks.textContent = tasks.length;
  pendingTasks.textContent = tasks.filter(task => !task.completed).length;
  completedTasks.textContent = tasks.filter(task => task.completed).length;
}

function renderTasks() {
  const pending = tasks.filter(task => !task.completed);

  if (pending.length === 0) {
    taskList.innerHTML = `<div class="empty-state">No pending tasks available.</div>`;
    return;
  }

  taskList.innerHTML = pending.map(task => `
    <div class="task-item">
      <div class="task-meta">
        <h3>${task.title}</h3>
        <p>${formatDate(task.date)}</p>
        <span class="priority ${getPriorityClass(task.priority)}">${task.priority}</span>
      </div>

      <div class="task-actions">
        <button class="action-btn edit-btn" onclick="editTask(${task.id})">Edit</button>
        <button class="action-btn complete-btn" onclick="completeTask(${task.id})">Complete</button>
        <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

function renderHistory() {
  const completed = tasks.filter(task => task.completed);

  if (completed.length === 0) {
    historyList.innerHTML = `<div class="empty-state">No completed task history found.</div>`;
    return;
  }

  historyList.innerHTML = completed.map(task => `
    <div class="history-item">
      <div class="history-meta">
        <h3>${task.title}</h3>
        <p>${formatDate(task.date)} · ${task.priority}</p>
      </div>

      <div class="history-actions">
        <button class="action-btn restore-btn" onclick="restoreTask(${task.id})">Restore</button>
        <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

function renderAll() {
  saveTasks();
  renderStats();
  renderTasks();
  renderHistory();
}

function resetForm() {
  taskForm.reset();
  editTaskId = null;
  formHeading.textContent = "Add New Task";
  submitBtn.textContent = "Add Task";
  cancelEditBtn.classList.add("hidden");
}

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = taskTitle.value.trim();
  const date = taskDate.value;
  const priority = taskPriority.value;

  if (!title || !date || !priority) return;

  if (editTaskId) {
    tasks = tasks.map(task =>
      task.id === editTaskId
        ? { ...task, title, date, priority }
        : task
    );
  } else {
    tasks.unshift({
      id: Date.now(),
      title,
      date,
      priority,
      completed: false
    });
  }

  renderAll();
  resetForm();
  switchSection("dashboard");
});

cancelEditBtn.addEventListener("click", resetForm);

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  if (!task) return;

  taskTitle.value = task.title;
  taskDate.value = task.date;
  taskPriority.value = task.priority;

  editTaskId = id;
  formHeading.textContent = "Update Task";
  submitBtn.textContent = "Update Task";
  cancelEditBtn.classList.remove("hidden");

  switchSection("add-task");
}

function completeTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: true } : task
  );
  renderAll();
}

function restoreTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: false } : task
  );
  renderAll();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderAll();
}

clearAllDataBtn.addEventListener("click", function () {
  const confirmClear = confirm("Are you sure you want to clear all task data?");
  if (!confirmClear) return;

  tasks = [];
  renderAll();
  resetForm();
});

clearCompletedBtn.addEventListener("click", function () {
  tasks = tasks.filter(task => !task.completed);
  renderAll();
});

function switchSection(sectionId) {
  sections.forEach(section => {
    section.classList.remove("active");
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
  });

  document.getElementById(sectionId).classList.add("active");
  document.querySelector(`[data-section="${sectionId}"]`).classList.add("active");

  const activeLinkText = document.querySelector(`[data-section="${sectionId}"]`).textContent;
  pageTitle.textContent = activeLinkText;

  sidebar.classList.remove("show");
  overlay.classList.remove("show");
}

navLinks.forEach(link => {
  link.addEventListener("click", function () {
    const sectionId = this.getAttribute("data-section");
    switchSection(sectionId);
  });
});

menuBtn.addEventListener("click", function () {
  sidebar.classList.add("show");
  overlay.classList.add("show");
});

closeSidebar.addEventListener("click", function () {
  sidebar.classList.remove("show");
  overlay.classList.remove("show");
});

overlay.addEventListener("click", function () {
  sidebar.classList.remove("show");
  overlay.classList.remove("show");
});

renderAll();