"use strict";

import { demoTasks, variantTasks, variantNumber } from "./data.js";
import {
  createTask,
  findTaskById,
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
} from "./task-service.js";

function printStats(label, tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(`--- ${label} ---`);
  console.log(`Всего: ${total}; выполнено: ${completed}; осталось: ${pending}`);
  if (total === 0) {
    console.log("Задач пока нет");
  } else {
    console.log(`Прогресс: ${progress.toFixed(1)}%`);
  }
}

console.log(" ОБЩИЙ СЦЕНАРИЙ (demoTasks) ");

printStats("Исходный набор", demoTasks);
console.log("Названия:", getTaskTitles(demoTasks).join(" | "));
console.log("Невыполненные id:", getPendingTasks(demoTasks).map((t) => t.id).join(", "));
console.log("Найдена id=4:", findTaskById(demoTasks, 4)?.title ?? "не найдена");

let current = demoTasks;

let r = addTask(current, 20, "Добавить проверку", "high");
console.log(r.ok ? "Добавление id=20: OK" : `Ошибка: ${r.error}`);
if (r.ok) current = r.tasks;

r = setTaskCompleted(current, 4, true);
console.log(r.ok ? "setTaskCompleted id=4 -> true: OK" : `Ошибка: ${r.error}`);
if (r.ok) current = r.tasks;

r = renameTask(current, 10, "Подготовить инструкцию запуска");
console.log(r.ok ? "renameTask id=10: OK" : `Ошибка: ${r.error}`);
if (r.ok) current = r.tasks;

r = removeTask(current, 7);
console.log(r.ok ? "removeTask id=7: OK" : `Ошибка: ${r.error}`);
if (r.ok) current = r.tasks;

printStats("После операций", current);
console.log("Итоговые id:", current.map((t) => t.id).join(", "));

// Показать отказ
r = addTask(current, 20, "Дубликат", "low");
console.log("Повторное добавление id=20:", r.ok ? "OK" : `Ошибка: ${r.error}`);

// Проверка сохранности исходного набора
console.log("demoTasks остался:", demoTasks.map((t) => t.id).join(", "));
printStats("demoTasks (не изменён)", demoTasks);

// ======= ВАРИАНТ 8 =======
console.log("\n ВАРИАНТ 8 (variantTasks) ");

printStats("Исходный набор варианта 8", variantTasks);

let v = variantTasks;

r = addTask(v, 80, "Оформить приложение", "low");
console.log(r.ok ? "Добавление id=80: OK" : `Ошибка: ${r.error}`);
if (r.ok) v = r.tasks;

r = setTaskCompleted(v, 11, true);
console.log(r.ok ? "setTaskCompleted id=11 -> true: OK" : `Ошибка: ${r.error}`);
if (r.ok) v = r.tasks;

r = renameTask(v, 23, "Обновить требования к оформлению");
console.log(r.ok ? "renameTask id=23: OK" : `Ошибка: ${r.error}`);
if (r.ok) v = r.tasks;

r = removeTask(v, 37);
console.log(r.ok ? "removeTask id=37: OK" : `Ошибка: ${r.error}`);
if (r.ok) v = r.tasks;

r = addTask(v, 80, "Дубликат", "low");
console.log("Повторное добавление id=80:", r.ok ? "OK" : `Ошибка: ${r.error}`);

printStats("Итог варианта 8", v);
console.log("Итоговые id варианта 8:", v.map((t) => t.id).join(", "));

console.log("variantTasks остался:", variantTasks.map((t) => t.id).join(", "));