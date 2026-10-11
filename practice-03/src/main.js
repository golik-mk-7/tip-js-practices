"use strict";

import { demoTasks, variantTasks, variantNumber } from "./data.js";
import {
  findTaskById,
  setTaskCompleted,
  removeTask,
} from "./task-service.js";
import { getVisibleTasks } from "./task-selectors.js";
import {
  renderTaskList,
  renderSummary,
  renderEmptyState,
} from "./task-view.js";

//  Состояние 

function getInitialTasks() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("dataset") === "variant") {
    return variantTasks.map((task) => ({ ...task }));
  }
  return demoTasks.map((task) => ({ ...task }));
}

let currentTasks = getInitialTasks();
let currentFilter = "all";

//  DOM-контейнеры 

const listEl = document.getElementById("task-list");
const summaryEl = document.getElementById("task-summary");
const emptyEl = document.getElementById("empty-message");
const messageEl = document.getElementById("operation-message");
const filtersEl = document.getElementById("task-filters");

//  Отрисовка 

function renderApp() {
  const visible = getVisibleTasks(currentTasks, currentFilter);

  renderTaskList(listEl, visible);
  renderSummary(summaryEl, currentTasks, visible.length);
  renderEmptyState(emptyEl, currentTasks.length, visible.length);

  // Активный фильтр
  filtersEl.querySelectorAll("button[data-filter]").forEach((btn) => {
    const isActive = btn.dataset.filter === currentFilter;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

function showMessage(text) {
  if (text) {
    messageEl.textContent = text;
    messageEl.hidden = false;
  } else {
    messageEl.textContent = "";
    messageEl.hidden = true;
  }
}

//  Фокус 

function restoreTaskFocus(id, action) {
  const selector = `li[data-task-id="${id}"] button[data-action="${action}"]`;
  const btn = listEl.querySelector(selector);
  if (btn) {
    btn.focus();
    return;
  }
  // Задача исчезла (удалена или скрыта фильтром) — фокус на активный фильтр
  const active = filtersEl.querySelector("button.is-active");
  if (active) active.focus();
}

//  Обработчики 

function handleTaskListClick(event) {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("button[data-action]");
  if (!button || !listEl.contains(button)) return;

  const action = button.dataset.action;
  if (action !== "toggle" && action !== "delete") return;

  const card = button.closest("li[data-task-id]");
  if (!card) return;

  const idRaw = card.dataset.taskId;
  const id = Number(idRaw);

  if (!Number.isSafeInteger(id) || id <= 0) {
    showMessage(`Ошибка: некорректный идентификатор "${idRaw}"`);
    return;
  }

  const task = findTaskById(currentTasks, id);
  if (!task) {
    showMessage(`Ошибка: задача с id=${id} не найдена`);
    return;
  }

  let result;
  if (action === "toggle") {
    result = setTaskCompleted(currentTasks, id, !task.completed);
  } else {
    result = removeTask(currentTasks, id);
  }

  if (!result.ok) {
    showMessage(`Ошибка: ${result.error}`);
    return;
  }

  currentTasks = result.tasks;
  showMessage("");
  renderApp();
  restoreTaskFocus(id, action);
}

function handleFilterClick(event) {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("button[data-filter]");
  if (!button || !filtersEl.contains(button)) return;

  const filter = button.dataset.filter;
  if (filter !== "all" && filter !== "pending" && filter !== "completed") {
    return;
  }

  currentFilter = filter;
  showMessage("");
  renderApp();
}

//  Запуск 

listEl.addEventListener("click", handleTaskListClick);
filtersEl.addEventListener("click", handleFilterClick);

renderApp();