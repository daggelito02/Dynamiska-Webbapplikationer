import { getRandomQuote } from "./quotes-retriver.js";

const BUTTON = document.querySelector("button");
const TEXT = document.querySelector(".text");
const AUTHOR = document.querySelector(".author");

BUTTON.addEventListener("click", buttonClicked);

function buttonClicked(evt) {
    const randomQuote = getRandomQuote();
    TEXT.textContent = randomQuote.quote;
    AUTHOR.textContent = `– ${randomQuote.quotee}`;
}
