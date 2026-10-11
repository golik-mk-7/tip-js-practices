"use strict";

import { getTaskStats } from "./task-service.js";

const PRIORITY_LABELS = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

/**
 * Создаёт DOM-элемент карточки задачи.
 * НЕ добавляет его в документ.
 */
export function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-card";
  li.dataset.taskId = String(task.id);
  if (task.completed) {
    li.classList.add("is-completed");
  }

  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = task.title;

  const status = document.createElement("span");
  status.className = "task-status";
  status.textContent = task.completed ? "Выполнена" : "В работе";

  const priority = document.createElement("span");
  priority.className = "task-priority";
  priority.dataset.priority = task.priority;
  priority.textContent = PRIORITY_LABELS[task.priority] ?? task.priority;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.dataset.action = "toggle";
  toggleBtn.setAttribute("aria-pressed", String(task.completed));
  const toggleLabel = document.createElement("span");
  toggleLabel.className = "action-label";
  toggleLabel.textContent = "Выполнена";
  toggleBtn.append(toggleLabel);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.dataset.action = "delete";
  const deleteLabel = document.createElement("span");
  deleteLabel.className = "action-label";
  deleteLabel.textContent = "Удалить";
  deleteBtn.append(deleteLabel);

  actions.append(toggleBtn, deleteBtn);

  li.append(title, status, priority, actions);
  return li;
}

/**
 * Заменяет дочерние элементы списка карточками переданных задач.
 * Сам listElement сохраняется.
 */
export function renderTaskList(listElement, tasks) {
  const cards = tasks.map((task) => createTaskElement(task));
  listElement.replaceChildren(...cards);
}

/**
 * Обновляет сводку.
 */
export function renderSummary(summaryElement, tasks, visibleCount) {
  const stats = getTaskStats(tasks);

  const set = (key, value) => {
    const el = summaryElement.querySelector(`[data-stat="${key}"]`);
    if (el) el.textContent = String(value);
  };

  set("total", stats.total);
  set("completed", stats.completed);
  set("pending", stats.pending);
  set("progress", `${stats.progress.toFixed(1)}%`);
  set("visible", visibleCount);
}

/**
 * Показывает / скрывает сообщение о пустом состоянии.
 */
export function renderEmptyState(messageElement, total, visibleCount) {
  if (visibleCount > 0) {
    messageElement.textContent = "";
    messageElement.hidden = true;
    return;
  }
  if (total === 0) {
    messageElement.textContent = "Список задач пуст.";
  } else {
    messageElement.textContent = "Нет задач по выбранному фильтру.";
  }
  messageElement.hidden = false;
}