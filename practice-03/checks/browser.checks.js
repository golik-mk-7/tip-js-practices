"use strict";

const frame = document.getElementById("test-frame");
const report = document.getElementById("report");
const summaryEl = document.getElementById("summary");

let passed = 0;
let failed = 0;
const logs = [];

function log(text, ok) {
  logs.push({ text, ok });
  if (ok) passed += 1; else failed += 1;
  render();
}

function render() {
  report.innerHTML = "";
  for (const { text, ok } of logs) {
    const p = document.createElement("p");
    p.className = ok ? "ok" : "fail";
    p.textContent = (ok ? "OK    " : "FAIL  ") + text;
    report.append(p);
  }
  summaryEl.textContent = `Всего: ${passed + failed}. Пройдено: ${passed}. Ошибок: ${failed}.`;
}

function assert(condition, message) {
  log(message, Boolean(condition));
}

function waitFrame() {
  return new Promise((resolve) => {
    if (frame.contentDocument && frame.contentDocument.readyState === "complete") {
      resolve();
      return;
    }
    frame.addEventListener("load", () => resolve(), { once: true });
  });
}

async function run() {
  await waitFrame();
  const doc = frame.contentDocument;

  //  1. Базовая структура страницы 
  assert(doc.getElementById("task-list") !== null, "Найден ul#task-list");
  assert(doc.getElementById("task-summary") !== null, "Найдена сводка #task-summary");
  assert(doc.getElementById("task-filters") !== null, "Найдены фильтры #task-filters");

  //  2. Карточки отрисованы 
  const cards = doc.querySelectorAll("#task-list .task-card");
  assert(cards.length === 4, `Отрисовано 4 карточки (факт: ${cards.length})`);

  //  3. Структура карточки 
  const firstCard = cards[0];
  assert(firstCard.dataset.taskId === "1", "Первая карточка: data-task-id=1");
  assert(firstCard.querySelector(".task-title") !== null, "У карточки есть .task-title");
  assert(firstCard.querySelector(".task-status") !== null, "У карточки есть .task-status");
  assert(firstCard.querySelector(".task-priority") !== null, "У карточки есть .task-priority");
  assert(firstCard.querySelector('button[data-action="toggle"]') !== null, "Есть кнопка toggle");
  assert(firstCard.querySelector('button[data-action="delete"]') !== null, "Есть кнопка delete");

  //  4. Сводка 
  const total = doc.querySelector('[data-stat="total"]').textContent;
  const completed = doc.querySelector('[data-stat="completed"]').textContent;
  const pending = doc.querySelector('[data-stat="pending"]').textContent;
  const progress = doc.querySelector('[data-stat="progress"]').textContent;
  const visible = doc.querySelector('[data-stat="visible"]').textContent;

  assert(total === "4", `Сводка: всего 4 (факт: ${total})`);
  assert(completed === "2", `Сводка: выполнено 2 (факт: ${completed})`);
  assert(pending === "2", `Сводка: осталось 2 (факт: ${pending})`);
  assert(progress === "50.0%", `Сводка: прогресс 50.0% (факт: ${progress})`);
  assert(visible === "4", `Сводка: показано 4 (факт: ${visible})`);

  //  5. Безопасный вывод текста 
  const titleEl = firstCard.querySelector(".task-title");
  assert(titleEl.children.length === 0, "Название задачи — текстовый узел, без вложенных HTML-элементов");
  assert(titleEl.textContent === "Изучить функции", "Название первой задачи корректно");

  //  6. Класс is-completed у выполненной 
  assert(firstCard.classList.contains("is-completed"), "Выполненная задача имеет класс is-completed");

  //  7. Кнопка toggle: aria-pressed 
  const toggleBtn = firstCard.querySelector('button[data-action="toggle"]');
  assert(toggleBtn.getAttribute("aria-pressed") === "true", "aria-pressed=true у выполненной");

  //  8. Повторный рендер не дублирует 
  // Перезагружаем iframe — эмулируем "второй рендер"
  const beforeCount = doc.querySelectorAll("#task-list .task-card").length;
  const event = new frame.contentWindow.Event("click", { bubbles: true });
  // Клик по активному фильтру — вызывает renderApp
  const allBtn = doc.querySelector('#task-filters button[data-filter="all"]');
  allBtn.dispatchEvent(event);

  const afterCount = doc.querySelectorAll("#task-list .task-card").length;
  assert(afterCount === beforeCount, `Повторный рендер не дублирует (было ${beforeCount}, стало ${afterCount})`);

  //  9. Фильтр «В работе» 
  const pendingBtn = doc.querySelector('#task-filters button[data-filter="pending"]');
  pendingBtn.dispatchEvent(new frame.contentWindow.Event("click", { bubbles: true }));
  const visibleAfterFilter = doc.querySelectorAll("#task-list .task-card").length;
  assert(visibleAfterFilter === 2, `Фильтр «В работе»: 2 карточки (факт: ${visibleAfterFilter})`);

  const visibleStat = doc.querySelector('[data-stat="visible"]').textContent;
  assert(visibleStat === "2", `«Показано» = 2 после фильтра (факт: ${visibleStat})`);

  //  10. Общая сводка не меняется при фильтрации 
  const totalAfterFilter = doc.querySelector('[data-stat="total"]').textContent;
  assert(totalAfterFilter === "4", `Общая сводка «Всего» остаётся 4 (факт: ${totalAfterFilter})`);

  //  11. Возврат на «Все» 
  allBtn.dispatchEvent(new frame.contentWindow.Event("click", { bubbles: true }));
  const afterAll = doc.querySelectorAll("#task-list .task-card").length;
  assert(afterAll === 4, `Возврат на «Все»: 4 карточки (факт: ${afterAll})`);

  //  12. Пустое состояние при фильтре «Выполненные» на пустом списке 
  // Проверяем, что .empty-message пока не показан (карточек > 0)
  const emptyEl = doc.getElementById("empty-message");
  assert(emptyEl.hidden === true, "Пустое сообщение скрыто, когда есть карточки");

  //  Итог 
  console.log(`Проверок: ${passed + failed}, пройдено: ${passed}, ошибок: ${failed}`);
}

run().catch((e) => {
  log("Исключение: " + e.message, false);
});