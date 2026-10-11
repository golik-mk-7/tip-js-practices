"use strict";

//  Проверка id и названия 

function validateId(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }
  return { ok: true };
}

function validateTitle(rawTitle) {
  if (typeof rawTitle !== "string") {
    return { ok: false, error: "Название должно быть строкой" };
  }
  const title = rawTitle.trim();
  if (title.length < 1 || title.length > 100) {
    return { ok: false, error: "Название должно содержать от 1 до 100 символов" };
  }
  return { ok: true, title };
}

function validatePriority(priority) {
  const allowed = ["low", "medium", "high"];
  if (!allowed.includes(priority)) {
    return { ok: false, error: 'Приоритет должен быть "low", "medium" или "high"' };
  }
  return { ok: true };
}

//  Задание 2. createTask 

export function createTask(id, title, priority = "medium") {
  const idCheck = validateId(id);
  if (!idCheck.ok) return idCheck;

  const titleCheck = validateTitle(title);
  if (!titleCheck.ok) return titleCheck;

  const priorityCheck = validatePriority(priority);
  if (!priorityCheck.ok) return priorityCheck;

  return {
    ok: true,
    task: {
      id,
      title: titleCheck.title,
      completed: false,
      priority,
    },
  };
}

//  Задание 3. Чтение 
export function findTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

export function getPendingTasks(tasks) {
  return tasks.filter((task) => task.completed === false);
}

export function getTaskTitles(tasks) {
  return tasks.map((task) => task.title);
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed === true).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : (completed / total) * 100;
  return { total, completed, pending, progress };
}

//  Задание 4. Изменение 

export function addTask(tasks, id, title, priority = "medium") {
  const idCheck = validateId(id);
  if (!idCheck.ok) return idCheck;

  if (tasks.some((task) => task.id === id)) {
    return { ok: false, error: `Задача с id=${id} уже существует` };
  }

  const created = createTask(id, title, priority);
  if (!created.ok) return created;

  return { ok: true, tasks: [...tasks, created.task] };
}

export function setTaskCompleted(tasks, id, completed) {
  const idCheck = validateId(id);
  if (!idCheck.ok) return idCheck;

  if (typeof completed !== "boolean") {
    return { ok: false, error: "completed должен быть true или false" };
  }

  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: `Задача с id=${id} не найдена` };
  }

  const newTasks = tasks.map((task) =>
    task.id === id ? { ...task, completed } : task
  );
  return { ok: true, tasks: newTasks };
}

export function renameTask(tasks, id, title) {
  const idCheck = validateId(id);
  if (!idCheck.ok) return idCheck;

  const titleCheck = validateTitle(title);
  if (!titleCheck.ok) return titleCheck;

  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: `Задача с id=${id} не найдена` };
  }

  const newTasks = tasks.map((task) =>
    task.id === id ? { ...task, title: titleCheck.title } : task
  );
  return { ok: true, tasks: newTasks };
}

export function removeTask(tasks, id) {
  const idCheck = validateId(id);
  if (!idCheck.ok) return idCheck;

  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: `Задача с id=${id} не найдена` };
  }

  const newTasks = tasks.filter((task) => task.id !== id);
  return { ok: true, tasks: newTasks };
}