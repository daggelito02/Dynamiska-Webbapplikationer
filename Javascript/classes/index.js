// index.js
import { Person } from "./person.js";

// Skapa några personer
const anna = new Person("Anna", 25);
const kalle = new Person("Kalle", 17);
const lisa = new Person("Lisa", 33);

// Anropa metoderna
anna.sayHello();        // "Hej! Jag heter Anna och är 25 år gammal."
kalle.sayHello();       // "Hej! Jag heter Kalle och är 17 år gammal."
lisa.sayHello();        // "Hej! Jag heter Lisa och är 33 år gammal."

// Födelsedag
kalle.haveBirthday();   // 🎉 Grattis Kalle! Du är nu 18 år.

// Kolla vuxenstatus
console.log(anna.isAdult()); // true
console.log(kalle.isAdult()); // true (efter födelsedag)
console.log(lisa.isAdult()); // true
