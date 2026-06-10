let tasks = JSON.parse(localStorage.getItem("mytasks") || "[]");
let currentTab = "all";

function saveTasks() {
  localStorage.setItem("mytasks", JSON.stringify(tasks));
}

function updateStats() {
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  document.getElementById("s-total").textContent   = total;
  document.getElementById("s-pending").textContent = total - done;
  document.getElementById("s-done").textContent    = done;
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000)    return "just now";
  if (diff < 3600000)  return Math.floor(diff / 60000) + "m ago";
  if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
  return new Date(ts).toLocaleDateString("en", { month: "short", day: "numeric" });
}

function escHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function addTask() {
  const input    = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (!taskText) return;
  tasks.push({ id: Date.now(), text: taskText, done: false, created: Date.now() });
  input.value = "";
  saveTasks();
  showTasks();
}

function showTasks() {
  const taskList = document.getElementById("taskList");
  updateStats();

  const filtered = tasks.filter(task =>
    currentTab === "all"    ? true :
    currentTab === "active" ? !task.done :
    task.done
  );

  if (filtered.length === 0) {
    taskList.innerHTML = `
      <div class="empty">
        <i class="ti ti-clipboard-list"></i>
        <p>No tasks here.</p>
      </div>`;
    return;
  }

  taskList.innerHTML = filtered.map(task => `
    <div class="task-item ${task.done ? "done" : ""}">
      <div class="checkbox ${task.done ? "checked" : ""}" onclick="toggleTask(${task.id})">
        ${task.done ? '<i class="ti ti-check"></i>' : ""}
      </div>
      <div class="task-info">
        <div class="task-text">${escHtml(task.text)}</div>
        <div class="task-meta">${timeAgo(task.created)}</div>
      </div>
      <button class="del-btn" onclick="deleteTask(${task.id})">
        <i class="ti ti-trash"></i>
      </button>
    </div>
  `).join("");
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) { task.done = !task.done; saveTasks(); showTasks(); }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  showTasks();
}

function clearDone() {
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].done) tasks.splice(i, 1);
  }
  saveTasks();
  showTasks();
}

function setTab(tab, el) {
  currentTab = tab;
  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  showTasks();
}

document.getElementById("taskInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") addTask();
});

showTasks();