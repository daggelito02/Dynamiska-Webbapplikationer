// Hämta alla bilder med klassen "hero"
const heroes = document.querySelectorAll(".hero");

// Variabel för att hålla koll på vilken bild som ska visas härnäst
let currentIndex = 0;

// Lyssna efter tangenttryckningar
document.addEventListener("keydown", (event) => {
  // Kontrollera om användaren tryckt på högerpil (ArrowRight)
  if (event.key === "ArrowRight") {
    // Finns det fler bilder att visa?
    if (currentIndex < heroes.length) {
      // Ta bort klassen "hidden" från nästa bild
      heroes[currentIndex].classList.remove("hidden");

      // Gå vidare till nästa index inför nästa tryck
      currentIndex++;
    } else {
      console.log("Alla bilder är redan synliga!");
    }
  }
});
