document.addEventListener("DOMContentLoaded", function () {
    // Fetch headlines from the text file or replace with api call
    fetch('headlines.txt')
        .then(response => response.text())
        .then(data => {
            // Split headlines by new lines and join them with separators
            let headlinesArray = data.split('\n').filter(Boolean); // Remove empty lines
            let newsHeadlines = headlinesArray.join(' /// '); // Add separator like in the image

            // Insert headlines into the span
            document.getElementById('news-headlines').textContent = newsHeadlines;
        })
        .catch(error => {
            console.error("Error loading headlines: ", error);
            document.getElementById('news-headlines').textContent = "Failed to load news!";
        });
});