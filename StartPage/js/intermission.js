// Countdown Timer
let countdownElement = document.getElementById('countdown');
let timeLeft = 5; //In Seconds

function updateCountdown() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (timeLeft > 0) {
        timeLeft--;
    } else {
        clearInterval(countdownInterval);
        countdownElement.textContent = "Game Resuming!";
    }
}
//Makes the countdown update every second on screen
let countdownInterval = setInterval(updateCountdown, 1000);


