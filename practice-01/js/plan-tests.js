"use strict";

function plan(totalTasks, completedTasks, dailyLimit) {
  const label = `total=${JSON.stringify(totalTasks)}, completed=${JSON.stringify(completedTasks)}, limit=${JSON.stringify(dailyLimit)}`;

  const tasksValid =
    Number.isInteger(totalTasks) &&
    Number.isInteger(completedTasks) &&
    totalTasks >= 0 && totalTasks <= 1000 &&
    completedTasks >= 0 && completedTasks <= totalTasks;

  const limitValid =
    Number.isInteger(dailyLimit) &&
    dailyLimit >= 1 && dailyLimit <= 1000;

  if (!tasksValid) {
    console.log(`${label} => Ошибка: недопустимое количество задач`);
    return;
  }
  if (!limitValid) {
    console.log(`${label} => Ошибка: недопустимая дневная норма`);
    return;
  }

  let remaining = totalTasks - completedTasks;

  if (remaining === 0) {
    console.log(`${label} => Все задачи уже выполнены, дней: 0`);
    return;
  }

  let day = 0;
  const steps = [];
  while (remaining > 0) {
    day += 1;
    const doneToday = Math.min(dailyLimit, remaining);
    remaining -= doneToday;
    steps.push(`д${day}:${doneToday}`);
  }
  console.log(`${label} => дней ${day} (${steps.join(", ")})`);
}

plan(14, 4, 4);
plan(10, 4, 3);
plan(5, 3, 10);
plan(5, 5, 2);
plan(0, 0, 2);
plan(5, 2, 0);
plan(5, 2, 1.5);
plan(5, 6, 2);
plan(5, 2, "2");
plan(5, 2, 1001);