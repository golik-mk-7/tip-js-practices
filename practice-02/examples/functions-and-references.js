"use strict";

//  Эксперимент 1. sum с числами и со строкой 
function sum(a, b) {
  return a + b;
}
console.log("Э1: sum(2, 3) =", sum(2, 3));
console.log("Э1: sum('2', 3) =", sum("2", 3));

//  Эксперимент 2. Стрелочная функция с телом в {} 
const square = (x) => {
  return x * x; // ← намеренно пропущен return
};
console.log("Э2: square(4) =", square(4));

//  Эксперимент 3. Присваивание объекта второй переменной 
const original = { title: "Черновик", published: false };
const alias = original;
alias.published = true;
console.log("Э3: original.published =", original.published);
console.log("Э3: original === alias =", original === alias);

//  Эксперимент 4. Spread массива объектов 
const items = [{ id: 1, done: false }];
const copied = [...items];
copied[0].done = true;
console.log("Э4: items[0].done =", items[0].done);
console.log("Э4: items === copied =", items === copied);

//  Эксперимент 5. Spread объекта и повторное свойство 
const oldBook = { id: 12, title: "Черновик", available: false };
const newBook = { ...oldBook, available: true };
console.log("Э5: oldBook.available =", oldBook.available);
console.log("Э5: newBook.available =", newBook.available);
console.log("Э5: oldBook === newBook =", oldBook === newBook);

//  Эксперимент 6. Параметр по умолчанию 
function makeCaption(text = "Без названия") {
  return text;
}
console.log("Э6: makeCaption() =", makeCaption());
console.log("Э6: makeCaption(undefined) =", makeCaption(undefined));
console.log("Э6: makeCaption(null) =", makeCaption(null));
console.log("Э6: makeCaption('') =", makeCaption(""));