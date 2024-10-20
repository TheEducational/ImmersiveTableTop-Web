function setupAudioVisualizer(audioElementId, canvasElementId) {
    var audio = document.getElementById(audioElementId);
    var canvas = document.getElementById(canvasElementId);
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioContext.createAnalyser();
    var ctx = canvas.getContext('2d');
    var source = audioContext.createMediaElementSource(audio);

    //This is where you connect the track to the analyser which is built into JS
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    //This changes how many bars will appear and how long with will hold it for.
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);


    // This is where you go to draw the size of the bar's
    //This also uses the frequency data that is within the mp3 file which will then let the bars move
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        // This is where you can change with width/lenght of the bars being displayed.
        // Change the 2.5 to how big you want the bars
        var barWidth = (canvas.width / bufferLength) * 2.5;
        var barHeight;
        var x = 0;
        // this is where it will pre render the bars with the appropriate colors based on the data array set above
        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            //This is where you set the dynamic Bar color
            ctx.fillStyle = 'rgb(' + (barHeight + 75) + ',50,50)';
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
        //Draw the Animation to the page
        requestAnimationFrame(draw);
    }

    draw(); // Start the visualizer loop
}

window.onload = function () {
    var audio = document.getElementById('visualizer-sound');
    setupAudioVisualizer('visualizer-sound', 'visualizer');
    audio.play();
}
//If you Want The Music to play on button press

// document.getElementById('play-visualizer').addEventListener("click", function () {
//     var audio = document.getElementById('visualizer-sound');

//     // Start the visualizer when the play button is clicked
//     setupAudioVisualizer('visualizer-sound', 'visualizer');

//     // Play the audio tied to the visualizer
//     audio.play();

//     // Optionally hide the play button after it's clicked
//     this.style.display = 'none';
// });

// window.onload = (event) => {
//     console.log("page is fully loaded");
//   };