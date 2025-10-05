// Hjälpfunktioner för cookies
function setCookie(name, value, days) {
    const expires = days ? `; expires=${new Date(Date.now() + days*24*60*60*1000).toUTCString()}` : '';
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
}

// Hämta element
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const commentInput = document.querySelector('#comment');

// Spara data i cookie vid ändring
function saveFormDataCookie() {
    setCookie('name', nameInput.value, 7);
    setCookie('email', emailInput.value, 7);
    setCookie('comment', commentInput.value, 7);
}

// Ladda data från cookie
function loadFormDataCookie() {
    nameInput.value = getCookie('name') || '';
    emailInput.value = getCookie('email') || '';
    commentInput.value = getCookie('comment') || '';
}

// EventListeners
nameInput.addEventListener('input', saveFormDataCookie);
emailInput.addEventListener('input', saveFormDataCookie);
commentInput.addEventListener('input', saveFormDataCookie);

// Ladda data när sidan öppnas
window.addEventListener('load', loadFormDataCookie);
