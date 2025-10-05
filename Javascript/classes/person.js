// person.js
export class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log(`Hej! Jag heter ${this.name} och är ${this.age} år gammal.`);
  }

  haveBirthday() {
    this.age++;
    console.log(`🎉 Grattis ${this.name}! Du är nu ${this.age} år.`);
  }

  isAdult() {
    return this.age >= 18;
  }
}
