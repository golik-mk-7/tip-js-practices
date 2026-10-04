"use strict";

const totalTasks = 14;
const completedTasks = 4;

const isValid =
  Number.isInteger(totalTasks) &&
  Number.isInteger(completedTasks) &&
  totalTasks >= 0 && totalTasks <= 1000 &&
  completedTasks >= 0 && completedTasks <= totalTasks;

if (!isValid) {
  console.log("Ошибка: недопустимые данные о задачах");
} else if (totalTasks === 0 && completedTasks === 0) {
  console.log("Задач пока нет");
} else {
  const remaining = totalTasks - completedTasks;
  const percentage = (completedTasks / totalTasks) * 100;

  let status;
  if (completedTasks === 0) {
    status = "Не начато";
  } else if (completedTasks === totalTasks) {
    status = "Завершено";
  } else {
    status = "В работе";
  }

  console.log(`Всего задач: ${totalTasks}`);
  console.log(`Выполнено: ${completedTasks}`);
  console.log(`Осталось: ${remaining}`);
  console.log(`Прогресс: ${percentage.toFixed(1)}%`);
  console.log(`Статус: ${status}`);
}