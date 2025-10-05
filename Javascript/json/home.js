// home.js

const myHome = {
  address: "Björkgatan 12, Stockholm",
  type: "Lägenhet",
  size: 75, // kvadratmeter
  rooms: [
    {
      name: "Vardagsrum",
      furniture: ["Soffa", "TV", "Matbord"],
      windows: 2,
    },
    {
      name: "Sovrum",
      furniture: ["Säng", "Garderob", "Skrivbord"],
      windows: 1,
    },
    {
      name: "Kök",
      furniture: ["Kylskåp", "Spis", "Diskmaskin"],
      windows: 1,
    },
  ],
  hasBalcony: true,
  pets: ["Katt"],
};

// Gör om objektet till en JSON-sträng
const jsonString = JSON.stringify(myHome, null, 2);

console.log("JSON-sträng:");
//console.dir(jsonString);
console.log(jsonString);

const jsonFromFriend = `{
    "name": "Sara",
    "age": 29,
    "hobbies": ["yoga", "resor", "matlagning"]
  }`;

const friendObject = JSON.parse(jsonFromFriend);

console.log("Omvandlat objekt:");
console.log(friendObject);
console.log(`${friendObject.name} gillar ${friendObject.hobbies[1]}.`);
