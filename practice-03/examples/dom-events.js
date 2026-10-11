"use strict";

function log(n, msg) {
  const el = document.querySelector(`[data-log="${n}"]`);
  if (el) el.textContent += msg + "\n";
}

function clearLogs() {
  document.querySelectorAll("[data-log]").forEach((el) => (el.textContent = ""));
}

//  Эксперимент 1 
document.querySelector('[data-test="1"]').addEventListener("click", () => {
  clearLogs();
  const missing = document.querySelector("#missing-element");
  const emptyList = document.querySelectorAll(".no-such-class");

  log(1, `missing = ${missing}`);                        // null
  log(1, `typeof missing = ${typeof missing}`);          // "object"
  log(1, `emptyList.length = ${emptyList.length}`);      // 0
  log(1, `missing?.textContent — безопасно, ошибки нет`);
  // log(1, missing.textContent); // ← упадёт: Cannot read properties of null
});

//  Эксперимент 2 
document.querySelector('[data-test="2"]').addEventListener("click", (e) => {
  clearLogs();
  const btn = e.currentTarget;
  const raw = btn.dataset.taskId;
  log(2, `raw = "${raw}"`);
  log(2, `typeof raw = ${typeof raw}`);     // "string"
  const num = Number(raw);
  log(2, `Number(raw) = ${num}`);
  log(2, `typeof num = ${typeof num}`);     // "number"
  log(2, `isSafeInteger = ${Number.isSafeInteger(num)}`); // true

  // Проверка "4abc"
  const bad = Number("4abc");
  log(2, `Number("4abc") = ${bad}`);        // NaN
  log(2, `isSafeInteger(NaN) = ${Number.isSafeInteger(bad)}`); // false
});

//  Эксперимент 3 
document.querySelector('[data-test="3"]').addEventListener("click", () => {
  clearLogs();
  const listEl = document.getElementById("exp3-list");

  // Сохранённая СТАТИЧНАЯ коллекция
  const savedItems = listEl.querySelectorAll("li");
  log(3, `До добавления: savedItems.length = ${savedItems.length}`); // 1

  // Добавляем два элемента
  const a = document.createElement("li");
  a.textContent = "Новая запись A";
  const b = document.createElement("li");
  b.textContent = "Новая запись B";
  listEl.append(a, b);

  log(3, `После добавления: savedItems.length = ${savedItems.length}`); // всё ещё 1 — статичная
  log(3, `Новый запрос: querySelectorAll("li").length = ${listEl.querySelectorAll("li").length}`); // 3
});

//  Эксперимент 4 
document.querySelector('[data-test="4"]').addEventListener("click", () => {
  clearLogs();
  const title = document.getElementById("exp4-title");
  const value = "<strong>Жирный</strong> & \"кавычки\"";

  // textContent — безопасно, выводит как текст
  title.textContent = value;
  log(4, `Через textContent: "${title.textContent}"`);
  log(4, `Внутри title.innerHTML: "${title.innerHTML}"`); // экранировано
  log(4, `title.children.length = ${title.children.length}`); // 0 — тегов НЕ создано
});

//  Эксперимент 5 
const exp5Button = document.getElementById("exp5-button");
const exp5Span = document.getElementById("exp5-span");

// Обработчик на span (фаза цели)
exp5Span.addEventListener("click", (e) => {
  log(5, `[SPAN] target.id = ${e.target.id}, phase = ${e.eventPhase}`); // 2
});

// Обработчик на кнопке (всплытие)
exp5Button.addEventListener("click", (e) => {
  log(5, `[BUTTON] target.id = ${e.target.id}, currentTarget.id = ${e.currentTarget.id}, phase = ${e.eventPhase}`); // 3
});

// Обработчик на документе — захват (сработает раньше)
document.addEventListener(
  "click",
  (e) => {
    if (e.target.id === "exp5-span") {
      log(5, `[DOCUMENT capture] target.id = ${e.target.id}, phase = ${e.eventPhase}`); // 1
    }
  },
  true
);

// Обработчик на документе — всплытие (сработает последним)
document.addEventListener("click", (e) => {
  if (e.target.id === "exp5-span") {
    log(5, `[DOCUMENT bubble] phase = ${e.eventPhase}`); // 3
  }
});

// Очистка логов для 5-го эксперимента при новом клике
exp5Button.addEventListener("click", () => {
  const el = document.querySelector('[data-log="5"]');
  if (el && el.textContent.length > 300) el.textContent = "";
});