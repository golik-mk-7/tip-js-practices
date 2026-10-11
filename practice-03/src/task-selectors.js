"use strict";

/**
 * Отбирает задачи по фильтру.
 * filter: "all" | "pending" | "completed"
 * Возвращает НОВЫЙ массив, не меняя исходный.
 */
export function getVisibleTasks(tasks, filter = "all") {
  if (filter === "all") {
    return [...tasks];
  }
  if (filter === "pending") {
    return tasks.filter((task) => task.completed === false);
  }
  if (filter === "completed") {
    return tasks.filter((task) => task.completed === true);
  }
  return [...tasks];
}