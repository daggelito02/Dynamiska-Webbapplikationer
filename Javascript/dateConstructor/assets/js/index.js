//Use the Date object to solve the assignment https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime
// Skapa ett datumobjekt från given tidssträng
const dateStr = "2014-02-11T22:54:26.613Z";
const date = new Date(dateStr);

// 1️⃣ Antal millisekunder sedan Unix Epoch (1 jan 1970)
const msSinceEpoch = date.getTime();
document.getElementById("1").textContent = msSinceEpoch.toLocaleString("sv-SE");

// 2️⃣ Svensk tid (lokal tid)
const swedishTime = date.toLocaleString("sv-SE", {
  timeZone: "Europe/Stockholm",
});
document.getElementById("2").textContent = swedishTime;

// 3️⃣ Vilken dag i månaden + veckodag
const dayOfMonth = date.getDate();
const weekday = date.toLocaleDateString("sv-SE", { weekday: "long" });
document.getElementById("4").textContent = `${dayOfMonth} (${weekday})`;

