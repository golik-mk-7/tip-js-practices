"use strict";

import assert from "node:assert/strict";
import { demoTasks, variantTasks, variantNumber } from "../src/data.js";
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
} from "../src/task-service.js";

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    fn();
    console.log(`OK    ${name}`);
    passed += 1;
  } catch (e) {
    console.log(`FAIL  ${name}`);
    console.log(`      ${e.message}`);
    failed += 1;
  }
}

console.log(" ЗАДАНИЕ 2: createTask ");

check("createTask: успех с приоритетом high", () => {
  const r = createTask(20, "Новая задача", "high");
  assert.equal(r.ok, true);
  assert.deepEqual(r.task, { id: 20, title: "Новая задача", completed: false, priority: "high" });
});

check("createTask: приоритет по умолчанию medium", () => {
  const r = createTask(20, "Задача");
  assert.equal(r.ok, true);
  assert.equal(r.task.priority, "medium");
});

check("createTask: undefined приоритет -> medium", () => {
  const r = createTask(20, "Задача", undefined);
  assert.equal(r.ok, true);
  assert.equal(r.task.priority, "medium");
});

check("createTask: обрезка пробелов в названии", () => {
  const r = createTask(20, "  Проверить  данные  ");
  assert.equal(r.ok, true);
  assert.equal(r.task.title, "Проверить  данные");
});

check("createTask: граница названия (1 символ)", () => {
  const r = createTask(1, "A");
  assert.equal(r.ok, true);
});

check("createTask: граница названия (100 символов)", () => {
  const r = createTask(1, "A".repeat(100));
  assert.equal(r.ok, true);
});

check("createTask: пустая строка -> ошибка", () => {
  const r = createTask(1, "");
  assert.equal(r.ok, false);
});

check("createTask: только пробелы -> ошибка", () => {
  const r = createTask(1, "   ");
  assert.equal(r.ok, false);
});

check("createTask: 101 символ -> ошибка", () => {
  const r = createTask(1, "A".repeat(101));
  assert.equal(r.ok, false);
});

check("createTask: title=42 -> ошибка", () => {
  const r = createTask(1, 42);
  assert.equal(r.ok, false);
});

check("createTask: title=null -> ошибка", () => {
  const r = createTask(1, null);
  assert.equal(r.ok, false);
});

check("createTask: title=undefined -> ошибка", () => {
  const r = createTask(1, undefined);
  assert.equal(r.ok, false);
});

check("createTask: id=0 -> ошибка", () => {
  assert.equal(createTask(0, "A").ok, false);
});

check("createTask: id=-1 -> ошибка", () => {
  assert.equal(createTask(-1, "A").ok, false);
});

check("createTask: id=1.5 -> ошибка", () => {
  assert.equal(createTask(1.5, "A").ok, false);
});

check("createTask: id='4' -> ошибка", () => {
  assert.equal(createTask("4", "A").ok, false);
});

check("createTask: id=NaN -> ошибка", () => {
  assert.equal(createTask(NaN, "A").ok, false);
});

check("createTask: id=Infinity -> ошибка", () => {
  assert.equal(createTask(Infinity, "A").ok, false);
});

check("createTask: id=null -> ошибка", () => {
  assert.equal(createTask(null, "A").ok, false);
});

check("createTask: id=undefined -> ошибка", () => {
  assert.equal(createTask(undefined, "A").ok, false);
});

check("createTask: id=MAX_SAFE_INTEGER -> успех", () => {
  const r = createTask(Number.MAX_SAFE_INTEGER, "A");
  assert.equal(r.ok, true);
});

check("createTask: id=MAX_SAFE_INTEGER+1 -> ошибка", () => {
  const r = createTask(Number.MAX_SAFE_INTEGER + 1, "A");
  assert.equal(r.ok, false);
});

check("createTask: приоритет 'urgent' -> ошибка", () => {
  assert.equal(createTask(1, "A", "urgent").ok, false);
});

check("createTask: приоритет 'HIGH' -> ошибка", () => {
  assert.equal(createTask(1, "A", "HIGH").ok, false);
});

check("createTask: приоритет ' high ' -> ошибка", () => {
  assert.equal(createTask(1, "A", " high ").ok, false);
});

check("createTask: приоритет null -> ошибка", () => {
  assert.equal(createTask(1, "A", null).ok, false);
});

check("createTask: приоритет 1 -> ошибка", () => {
  assert.equal(createTask(1, "A", 1).ok, false);
});

check("createTask: два вызова — разные объекты", () => {
  const a = createTask(1, "A").task;
  const b = createTask(1, "A").task;
  assert.notEqual(a, b);
  assert.deepEqual(a, b);
});

console.log("\n ЗАДАНИЕ 3: чтение ");

check("findTaskById: id=4 найден", () => {
  const t = findTaskById(demoTasks, 4);
  assert.equal(t.id, 4);
});

check("findTaskById: id=777 -> undefined", () => {
  assert.equal(findTaskById(demoTasks, 777), undefined);
});

check("findTaskById: '4' -> undefined", () => {
  assert.equal(findTaskById(demoTasks, "4"), undefined);
});

check("findTaskById: пустой массив -> undefined", () => {
  assert.equal(findTaskById([], 1), undefined);
});

check("getPendingTasks: [4, 7]", () => {
  assert.deepEqual(getPendingTasks(demoTasks).map((t) => t.id), [4, 7]);
});

check("getPendingTasks: пустой массив -> []", () => {
  assert.deepEqual(getPendingTasks([]), []);
});

check("getPendingTasks: все выполнены -> []", () => {
  const allDone = [{ id: 1, title: "A", completed: true, priority: "low" }];
  assert.deepEqual(getPendingTasks(allDone), []);
});

check("getPendingTasks: ничего не выполнено -> все", () => {
  const none = [
    { id: 1, title: "A", completed: false, priority: "low" },
    { id: 2, title: "B", completed: false, priority: "high" },
  ];
  assert.deepEqual(getPendingTasks(none).map((t) => t.id), [1, 2]);
});

check("getTaskTitles: порядок сохраняется", () => {
  assert.deepEqual(getTaskTitles(demoTasks), [
    "Изучить функции",
    "Подготовить модель задач",
    "Проверить методы массивов",
    "Оформить README",
  ]);
});

check("getTaskTitles: пустой массив -> []", () => {
  assert.deepEqual(getTaskTitles([]), []);
});

check("getTaskStats: demoTasks = 4/2/2/50", () => {
  assert.deepEqual(getTaskStats(demoTasks), { total: 4, completed: 2, pending: 2, progress: 50 });
});

check("getTaskStats: пустой массив -> 0/0/0/0", () => {
  assert.deepEqual(getTaskStats([]), { total: 0, completed: 0, pending: 0, progress: 0 });
});

check("getTaskStats: 4 задачи, 0 выполнено -> 0", () => {
  const tasks = [1, 2, 3, 4].map((id) => ({ id, title: "A", completed: false, priority: "low" }));
  assert.equal(getTaskStats(tasks).progress, 0);
});

check("getTaskStats: 4 задачи, 4 выполнено -> 100", () => {
  const tasks = [1, 2, 3, 4].map((id) => ({ id, title: "A", completed: true, priority: "low" }));
  assert.equal(getTaskStats(tasks).progress, 100);
});

check("getTaskStats: 3 задачи, 1 выполнена -> ~33.33", () => {
  const tasks = [
    { id: 1, title: "A", completed: true, priority: "low" },
    { id: 2, title: "B", completed: false, priority: "low" },
    { id: 3, title: "C", completed: false, priority: "low" },
  ];
  const p = getTaskStats(tasks).progress;
  assert.ok(Math.abs(p - 33.3333333333) < 0.001);
});

console.log("\n ЗАДАНИЕ 4: изменение ");

check("addTask: успех, 5 записей", () => {
  const r = addTask(demoTasks, 20, "Добавить проверку", "high");
  assert.equal(r.ok, true);
  assert.equal(r.tasks.length, 5);
  assert.equal(r.tasks[4].id, 20);
  assert.equal(demoTasks.length, 4);
});

check("addTask: в пустой массив", () => {
  const r = addTask([], 20, "A", "low");
  assert.equal(r.ok, true);
  assert.equal(r.tasks.length, 1);
  assert.equal(r.tasks[0].id, 20);
});

check("addTask: существующий id=4 -> ошибка", () => {
  const r = addTask(demoTasks, 4, "A", "low");
  assert.equal(r.ok, false);
  assert.equal(demoTasks.length, 4);
});

check("addTask: некорректное название -> ошибка", () => {
  const r = addTask(demoTasks, 99, "", "low");
  assert.equal(r.ok, false);
});

check("setTaskCompleted: успех true, потом false", () => {
  const r1 = setTaskCompleted(demoTasks, 4, true);
  assert.equal(r1.ok, true);
  assert.equal(r1.tasks.find((t) => t.id === 4).completed, true);
  const r2 = setTaskCompleted(r1.tasks, 4, false);
  assert.equal(r2.ok, true);
  assert.equal(r2.tasks.find((t) => t.id === 4).completed, false);
});

check("setTaskCompleted: строка 'false' -> ошибка", () => {
  assert.equal(setTaskCompleted(demoTasks, 4, "false").ok, false);
});

check("setTaskCompleted: число 0 -> ошибка", () => {
  assert.equal(setTaskCompleted(demoTasks, 4, 0).ok, false);
});

check("setTaskCompleted: null -> ошибка", () => {
  assert.equal(setTaskCompleted(demoTasks, 4, null).ok, false);
});

check("setTaskCompleted: undefined -> ошибка", () => {
  assert.equal(setTaskCompleted(demoTasks, 4, undefined).ok, false);
});

check("setTaskCompleted: нет id=99 -> ошибка", () => {
  assert.equal(setTaskCompleted(demoTasks, 99, true).ok, false);
});

check("renameTask: успех, поля сохранены", () => {
  const r = renameTask(demoTasks, 10, "  Новое название  ");
  assert.equal(r.ok, true);
  const updated = r.tasks.find((t) => t.id === 10);
  assert.equal(updated.title, "Новое название");
  assert.equal(updated.completed, true);
  assert.equal(updated.priority, "medium");
});

check("renameTask: пустая строка -> ошибка", () => {
  assert.equal(renameTask(demoTasks, 10, "").ok, false);
});

check("renameTask: нет id=99 -> ошибка", () => {
  assert.equal(renameTask(demoTasks, 99, "A").ok, false);
});

check("setTaskCompleted: некорректный id -> ошибка", () => {
  assert.equal(setTaskCompleted(demoTasks, "4", true).ok, false);
});

check("renameTask: некорректный id -> ошибка", () => {
  assert.equal(renameTask(demoTasks, 0, "A").ok, false);
});

check("removeTask: id=7 -> [1,4,10]", () => {
  const r = removeTask(demoTasks, 7);
  assert.equal(r.ok, true);
  assert.deepEqual(r.tasks.map((t) => t.id), [1, 4, 10]);
  assert.equal(demoTasks.length, 4);
});

check("removeTask: единственная -> []", () => {
  const single = [{ id: 1, title: "A", completed: false, priority: "low" }];
  const r = removeTask(single, 1);
  assert.equal(r.ok, true);
  assert.equal(r.tasks.length, 0);
});

check("removeTask: нет id=99 -> ошибка", () => {
  assert.equal(removeTask(demoTasks, 99).ok, false);
});

check("removeTask: пустой массив -> ошибка", () => {
  assert.equal(removeTask([], 1).ok, false);
});

console.log("\n СОХРАННОСТЬ ДАННЫХ ");

check("demoTasks не изменился после addTask", () => {
  const before = JSON.stringify(demoTasks);
  addTask(demoTasks, 999, "Тест", "low");
  assert.equal(JSON.stringify(demoTasks), before);
});

check("demoTasks не изменился после setTaskCompleted", () => {
  const before = JSON.stringify(demoTasks);
  setTaskCompleted(demoTasks, 4, true);
  assert.equal(JSON.stringify(demoTasks), before);
});

check("demoTasks не изменился после renameTask", () => {
  const before = JSON.stringify(demoTasks);
  renameTask(demoTasks, 10, "Новое");
  assert.equal(JSON.stringify(demoTasks), before);
});

check("demoTasks не изменился после removeTask", () => {
  const before = JSON.stringify(demoTasks);
  removeTask(demoTasks, 7);
  assert.equal(JSON.stringify(demoTasks), before);
});

console.log("\n ВАРИАНТ 8 ");

check("variantNumber === 8", () => {
  assert.equal(variantNumber, 8);
});

check("variantTasks: 6 задач с id [11,23,37,41,58,64]", () => {
  assert.deepEqual(variantTasks.map((t) => t.id), [11, 23, 37, 41, 58, 64]);
});

check("variantTasks: первые 3 выполнены", () => {
  assert.equal(variantTasks.filter((t) => t.completed).length, 3);
});

check("variantTasks: прогресс 50.0%", () => {
  const s = getTaskStats(variantTasks);
  assert.equal(s.total, 6);
  assert.equal(s.completed, 3);
  assert.equal(s.pending, 3);
  assert.equal(s.progress, 50);
});

check("variantTasks: приоритеты low/medium/high присутствуют", () => {
  const priorities = new Set(variantTasks.map((t) => t.priority));
  assert.ok(priorities.has("low"));
  assert.ok(priorities.has("medium"));
  assert.ok(priorities.has("high"));
});

//  ИТОГ 

console.log(`Пройдено: ${passed}`);
console.log(`Провалено: ${failed}`);


if (failed > 0) {
  process.exit(1);
}