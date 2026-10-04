"use strict";

const totalTasks = 14;
const completedTasks = 4;
const dailyLimit = 4;

const tasksValid =
  Number.isInteger(totalTasks) &&
  Number.isInteger(completedTasks) &&
  totalTasks >= 0 && totalTasks <= 1000 &&
  completedTasks >= 0 && completedTasks <= totalTasks;

const limitValid =
  Number.isInteger(dailyLimit) &&
  dailyLimit >= 1 && dailyLimit <= 1000;

if (!tasksValid) {
  console.log("Ошибка: недопустимое количество задач");
} else if (!limitValid) {
  console.log("Ошибка: недопустимая дневная норма");
} else {
  let remaining = totalTasks - completedTasks;

  if (remaining === 0) {
    console.log("Все задачи уже выполнены");
    console.log("Потребуется дней: 0");
  } else {
    console.log(`Осталось задач: ${remaining}`);
    let day = 0;

    while (remaining > 0) {
      day += 1;
      const doneToday = Math.min(dailyLimit, remaining);
      remaining -= doneToday;
      console.log(`День ${day}: выполнено ${doneToday}, осталось ${remaining}`);
    }

    console.log(`Потребуется дней: ${day}`);
  }
}