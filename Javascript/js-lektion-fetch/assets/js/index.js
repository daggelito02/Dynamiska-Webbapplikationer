import { getRandomQuote } from './quotes-retriver.js';

const BUTTON = document.querySelector('button');
const TEXT = document.querySelector('.text');
const AUTHOR = document.querySelector('.author');

BUTTON.addEventListener('click', buttonClicked);

async function buttonClicked() {
  TEXT.textContent = 'Hämtar citat...';
  AUTHOR.textContent = '';

  const quoteData = await getRandomQuote();

  if (quoteData) {
    TEXT.textContent = `"${quoteData.quote}"`;
    AUTHOR.textContent = `– ${quoteData.author}`;
  } else {
    TEXT.textContent = 'Kunde inte hämta citat 😔';
  }
}
