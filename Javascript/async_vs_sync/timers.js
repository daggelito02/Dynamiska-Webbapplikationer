// --- Funktion 1 ---
// Skriver ut ditt namn efter 5 sekunder
function showName() {
    console.log("Hej! Jag heter Dag 😄");
  }
  
  // Kör funktionen efter 5 sekunder (5000 millisekunder)
  setTimeout(showName, 5000);
  
  
  // --- Funktion 2 ---
  // Skriver ut datum och tid varje sekund i 10 sekunder
  function showDateAndTime() {
    let counter = 0; // Räknar sekunder
  
    const intervalId = setInterval(() => {
      const now = new Date();
      console.log(now.toLocaleString()); // Skriver ut t.ex. "2025-10-04 12:45:32"
  
      counter++;
  
      // När 10 sekunder gått, stoppa loopen
      if (counter === 10) {
        clearInterval(intervalId);
        console.log("✅ Klar! 10 sekunder har gått.");
      }
    }, 1000); // Kör var 1000 ms = 1 sekund
  }
  
  // Starta funktionen
  showDateAndTime();
  