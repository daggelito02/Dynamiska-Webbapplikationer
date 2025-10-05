const COUNTER = document.querySelector('.counter');
let myTimer = 0;

printTimer(myTimer++);

const INTERVALL = setInterval(() => {
    printTimer(myTimer++);
    
    if(myTimer === 10000000000) {
        clearInterval(INTERVALL);
    }
}, 1000);

function printTimer(time) {
    COUNTER.innerHTML = time;
}