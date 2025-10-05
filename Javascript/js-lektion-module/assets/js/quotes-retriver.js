import { QUOTES } from "./quotes.js";

export function getRandomQuote() {
    const index = Math.floor(Math.random() * QUOTES.length);
    return QUOTES[index];
}

export function getSpecificQuote(index) {
    if (index < 0 || index >= QUOTES.length) {
        console.error("Index out of range");
        return null;
    }
    return QUOTES[index];
}
