// // index.js

// // Hälsa användaren välkommen
// alert("Välkommen till denna lilla frågesports-test! Starta gemom att klicka på \"OK\"");

// // En konstant variable för frågor och svar
// const questions = [
//   {
//     question: "Viklet fotbollslag är bäst på söder?",
//     answer: "hammarby"
//   },
//   {
//     question: "Vilken form har en boll?",
//     answer: "rund"
//   },
//   {
//     question: "Vilken stad har en domkyrka?",
//     answer: "uppsala"
//   }
// ];

// // Variabel med resultatet
// let result = 0;

// // Loopar igenom frågorna
// for (let i = 0; i < questions.length; i++) {
//   const userAnswer = prompt(questions[i].question);

//   if (userAnswer && userAnswer.toLowerCase().trim() === questions[i].answer) {
//     result++;
//   }
// }

// Resultat
// alert("Du fick " + result + " av " + questions.length + " rätt!");

// Hälsa användaren
// alert("Välkommen till tärningsspelet! Klicka på OK för att börja.");

// // Be om spelarnas namn
// const player1 = prompt("Ange namn för spelare 1:");
// const player2 = prompt("Ange namn för spelare 2:");

// // Slumpa fram tärningskast (heltal 1–6)
// const roll1 = Math.floor(Math.random() * 6) + 1;
// const roll2 = Math.floor(Math.random() * 6) + 1;

// // Bestäm vinnare
// let message = player1 + " slog en " + roll1 + ".\n" + player2 + " slog en " + roll2 + ".\n\n";

// if (roll1 > roll2) {
//   message += player1 + " vinner! 🎉";
// } else if (roll2 > roll1) {
//   message += player2 + " vinner! 🎉";
// } else {
//   message += "Det blev lika! Ingen vinnare denna gång. 🤝";
// }

// // Visa resultat
// alert(message);

// --- Uppgift 1 ---
// Variabler
let name = "Dag";
let age = 30;

// Funktion som tar emot namn och ålder och skriver ut i konsolen
function printInfo(personName, personAge) {
  console.log("Namn: " + personName + ", Ålder: " + personAge);
}

// Anropa funktionen
printInfo(name, age);

// --- Uppgift 2 ---
// Felaktig sträng
let wrongString = "Java is awesome!";

// Ändra "Java" till "JavaScript"
let correctString = wrongString.replace("Java", "JavaScript");

// Skriv ut resultatet
console.log(correctString);

// --- Uppgift 1 ---
// Array med blandat innehåll
let mixedArray = [1, "hejsan", 3, "harry potter"];

// Funktion som loopar igenom och skriver ut varje element
function printArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}

// Anropa funktionen
printArray(mixedArray);


// --- Uppgift 2 ---
// Array med siffror
let numbers = [1, 2, 3, 4];

// Filtrera ut jämna tal (n % 2 === 0 betyder "resten blir 0 när delat på 2")
let evenNumbers = numbers.filter(n => n % 2 === 0);

console.log("Filtrerade jämna tal:", evenNumbers);

// 👉 Gissning: filter kommer ta bort alla udda tal och bara lämna [2, 4].
// När du kör koden ser du att det stämmer.


// --- Uppgift 3 ---
// Sträng som är baklänges
let backwards = "!looc ma I os ,looc si tpircSavaJ";

// Gör om till array, vänd på den och slå ihop igen
let forwards = backwards.split("").reverse().join("");

// Skriv ut resultatet
console.log(forwards);



// --- 1. Hitta elementet med id="h2" och dir:a det ---
const heading = document.getElementById("h2");
console.dir(heading); // visar hela objektstrukturen i konsolen


// --- 2. Hitta elementet med class="important-text" och kolla höjden ---
const importantText = document.querySelector(".important-text");
console.log("Height (px):", importantText.clientHeight); // visar höjd i pixlar


// --- 3. Hitta elementet med id="fifth" och ta bort det från DOM ---
const fifthElement = document.getElementById("fifth");
// Alternativ 1: Ta bort direkt
//fifthElement.remove();
// Alternativ 2 (äldre): fifthElement.parentNode.removeChild(fifthElement);


// --- 4. Spara alla element med klassen "item" och ändra textfärg ---
const items = document.querySelectorAll(".item");

// Loopa igenom NodeList och ändra färg
items.forEach(item => {
  item.style.color = "blue"; // du kan byta färg om du vill
});


// --- 5. Ändra innehållet i p.important-text ---
importantText.textContent = "Det här var ju trevligt!";

// --- 1. EventListener på knapp: hämta text från input och visa i <p> ---
const button = document.querySelector("button");
const input = document.querySelector("input");
const output = document.querySelector(".inputs-output");

button.addEventListener("click", () => {
  const text = input.value.trim();
  output.textContent = text ? text : "Du måste skriva något!";
});


// --- 2. Lägg till saknad fjärde punkt i <ol> ---
const ol = document.querySelector("ol");

// Skapa nytt <li> och lägg till på rätt plats
const fourthItem = document.createElement("li");
fourthItem.textContent = "Fjärde";
ol.appendChild(fourthItem);


// --- 3. Gör så att klick på en <li> i ol flyttar till ul ---
const ul = document.querySelector("ul");

// Funktion för att flytta element till ul
function moveToUnorderedList(event) {
  const item = event.target;
  ul.appendChild(item);
  item.removeEventListener("click", moveToUnorderedList);
  item.addEventListener("click", moveToOrderedList);
}

// Funktion för att flytta tillbaka till ol
function moveToOrderedList(event) {
  const item = event.target;
  ol.appendChild(item);
  item.removeEventListener("click", moveToOrderedList);
  item.addEventListener("click", moveToUnorderedList);
}

// --- Lägg till EventListeners på alla ol-element ---
ol.querySelectorAll("li").forEach(li => {
  li.addEventListener("click", moveToUnorderedList);
})

// xxxxxxxxxxxxxx

// ------------------------------------------------------
// 7. Lägg till en eventListener på knappen som hämtar text från input
//    och skriver ut den i <p class="inputs-output">
//const input = document.getElementById("oneInput");
//const button = document.querySelector("button");
//const output = document.querySelector(".inputs-output");

button.addEventListener("click", () => {
  output.textContent = input.value;
});

// ------------------------------------------------------
// 8. Skapa ett nytt <li> med texten "Fjärde" och lägg till på rätt plats
//const ol = document.querySelector("ol");
const newLi = document.createElement("li");
newLi.textContent = "Fjärde";
newLi.classList.add("item");

// Infoga på fjärde plats (innan nuvarande "Femte" som vi tog bort)
ol.insertBefore(newLi, ol.children[3]);

// ------------------------------------------------------
// 9. Lägg till eventListener så att klick på li flyttar raden till <ul>
//const ul = document.querySelector("ul");

function moveToList(event) {
  const li = event.target;
  ul.appendChild(li);
  li.removeEventListener("click", moveToList);
  li.addEventListener("click", moveBackToOl);
}

function moveBackToOl(event) {
  const li = event.target;
  ol.appendChild(li);
  li.removeEventListener("click", moveBackToOl);
  li.addEventListener("click", moveToList);
}

// Lägg till första lyssnaren på alla li i ol
ol.querySelectorAll("li").forEach(li => {
  li.addEventListener("click", moveToList);
});

// X