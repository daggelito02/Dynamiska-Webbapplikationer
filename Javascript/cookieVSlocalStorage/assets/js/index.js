// Hämta element
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const commentInput = document.querySelector('#comment');

// Funktion för att spara data
function saveFormData() {
    const formData = {
        name: nameInput.value,
        email: emailInput.value,
        comment: commentInput.value
    };
    localStorage.setItem('formData', JSON.stringify(formData));
}

// Funktion för att ladda data
function loadFormData() {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
        const data = JSON.parse(savedData);
        nameInput.value = data.name || '';
        emailInput.value = data.email || '';
        commentInput.value = data.comment || '';
    }
}

// EventListeners
nameInput.addEventListener('input', saveFormData);
emailInput.addEventListener('input', saveFormData);
commentInput.addEventListener('input', saveFormData);

// Ladda data när sidan öppnas
window.addEventListener('load', loadFormData);
