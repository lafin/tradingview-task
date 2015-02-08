Тестовое задание
===============
На позицию Программист-разработчик JavaScript

Собеседование.

#####1. Реализовать наследование классов через прототипы. Подробно разобрано: [тут](http://javascript.ru/tutorial/object/inheritance)

```javascript
function extend(Child, Parent) {
  var F = function() { }
  F.prototype = Parent.prototype
  Child.prototype = new F()
  Child.prototype.constructor = Child
  Child.superclass = Parent.prototype
}
// создали базовый класс
function Animal(..) { ... }

// создали класс
// и сделали его потомком базового
function Rabbit(..)  { ... }
extend(Rabbit, Animal)

// добавили в класс Rabbit методы и свойства
Rabbit.prototype.run = function(..) { ... }

// все, теперь можно создавать объекты
// класса-потомка и использовать методы класса-родителя
rabbit = new Rabbit(..)
rabbit.animalMethod()
```

#####2. Создать функцию для кеширования результатов сложных вычислений. Подробно разобрано: [тут](http://philogb.github.io/blog/2008/09/05/memoization-in-javascript/)

```javascript
function fib(x) {
    if(x < 2) {
      return 1; 
    } else {
      return fib(x-1) + fib(x-2);
    }
}

function memoize(fun) {
  return function(x) {
      fun.mem = fun.mem || {};
      return (x in fun.mem) ? fun.mem[x] : fun.mem[x] = fun(x);
  };
}

var fib = memoize(fib);
console.time('first');
console.log(fib(30));
console.timeEnd('first');

console.time('memoize');
console.log(fib(30));
console.timeEnd('memoize');
```

#####3. Примеры из ряда: что будет если написать так...

```javascript
function Foo() {}
Foo.prototype.bar = 42;
/* ... */
var foo = new Foo();
console.log(foo.bar); // 42
Foo.prototype.bar = 52;
console.log(foo.bar); // 52 
foo.bar = 12;
console.log(foo.bar); // 12
delete foo.bar;
console.log(foo.bar); // 52
```

```javascript
var a = 42;
(function() {
  var a = 15; // и если убрать var то 15
})();
console.log(a); // 42
```

```javascript
var o = {
  quack: function() {
    return this.name;
  },
  name: 'Duck'
};
console.log(o.quack()); // Duck
var quack = o.quack;
console.log(quack()); // вообще Chrome вернул '' но меня уверяли что должен быть Duck
// Пояснения от автора вопросов
// Эм… я что, правда так и сказал? Наверное, у меня мозг вырубился, извиняюсь. Это вопрос на то, `this` в js определяется в момент инстанцирования, или в момент вызова. И если бы в момент инстацирования («вернуть Duck»), как во всех остальных языках, этот вопрос вообще не нужен был.

console.log((o.quack)()); // Duck
console.log((0 || o.quack)()); // вообще Chrome вернул '' но меня уверяли что результат будет не предсказуем
// Пояснения от автора вопросов
// А вот тут могу прокомментировать, почему именно непредсказуемый (если интересно, конечно). Из-за того, что вызывается результат выражения, связка «объект-свойство» на момент вызова потеряна, и контекст стал равен undefined (сильное колдунство, обычно я и не ожидаю, что люди ответят на такое).
// Это значит, что в "use strict" this будет undefined, а undefined.name — ошибка. А в не-строгом режиме this будет window. А window.name — имя окна, то самое, которое присваивается во втором параметре window.open() или в атрибуте target у ссылки. Ну а по умолчанию оно пустая строка. Итого — непредсказуемее некуда :)
```

```javascript
var flag = true;
setTimeout(function() {
  flag = false;
}, 1000);

while(flag) {
  console.log(1);
}
```
