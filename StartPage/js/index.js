window.requestAnimFrame = (function () {
    return window.requestAnimationFrame
})();
var canvas = document.getElementById("space");
var c = canvas.getContext("2d");

//Number Of Stars
var numStars = 3000;
//Math For Star Movement
var radius = '0.' + Math.floor(Math.random() * 9) + 1;
var focalLength = canvas.width * 2;
var warp = 0;
var centerX, centerY;
var stars = [],
    star;
var i;
var animate = true;

//Start Of Stars
initializeStars();
function executeFrame() {

    if (animate)
        requestAnimFrame(executeFrame);
    moveStars();
    drawStars();
}
//Orienation of the Stars
function initializeStars() {
    centerX = canvas.width / 3;
    centerY = canvas.height / 3;

    stars = [];
    for (i = 0; i < numStars; i++) {
        star = {

            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * canvas.width,
            o: '0.' + Math.floor(Math.random() * 99) + 1
        };
        stars.push(star);
    }
}
//This is how to move the starts on the Z axis *DO NOT TOUCH*
function moveStars() {
    for (i = 0; i < numStars; i++) {
        star = stars[i];
        star.z--;

        if (star.z <= 0) {
            star.z = canvas.width;
        }
    }
}

function drawStars() {
    var pixelX, pixelY, pixelRadius;

    // Resize to the screen
    if (canvas.width != window.innerWidth || canvas.width != window.innerWidth) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeStars();
    }
    if (warp == 0) {
        c.fillStyle = "rgba(0,0,0,255)";
        c.fillRect(0, 0, canvas.width, canvas.height);
    }
    c.fillStyle = "rgba(209, 255, 255, " + radius + ")";
    for (i = 0; i < numStars; i++) {
        star = stars[i];

        pixelX = (star.x - centerX) * (focalLength / star.z);
        pixelX += centerX;
        pixelY = (star.y - centerY) * (focalLength / star.z);
        pixelY += centerY;
        pixelRadius = 1 * (focalLength / star.z);

        c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
        c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
        //c.fill("rgba(0,0,0,255)");

    }
}

document.getElementById('warp').addEventListener("click", function (e) {
    var sound = document.getElementById('warp-sound');
    sound.play();
    this.style.display = 'none';
    window.c.beginPath();
    // window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
    window.warp = warp ? 0 : 1;
    executeFrame();

    setTimeout(function () {

        window.location.href = "dashboard.html"; // Change to the new Page URL
    }, 4000); // This is in Miliseconds
});

executeFrame();

