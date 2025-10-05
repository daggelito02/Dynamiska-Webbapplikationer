const COUNTER = document.querySelector('.counter');
let myTimer = 0;

printTimer(myTimer++);

for (let index = 0; index < 10000000000; index++) {
    if (index % 1000 == 0 && index != 0) { 
        printTimer(myTimer++);
     }    
}

function printTimer(time) {
    COUNTER.innerHTML = time;
}