// Function to format time in minutes:seconds
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`; // Format as mm:ss
}

// Function to fetch music data from the JSON file
async function fetchMusicData() {
    try {
        const response = await fetch(musicFileUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data; // Return the entire data object
    } catch (error) {
        console.error('Error fetching music data:', error);
    }
}

// Function to display the currently playing song in a table
function displayCurrentlyPlaying(musicData) {
    const currentlyPlayingSection = document.getElementById('currentlyPlaying');
    const table = document.createElement('table');

    // Create table header
    const headerRow = document.createElement('tr');
    const headers = ['Song ID', 'Song', 'Current Time', 'Max Time'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Create table row for currently playing song
    const currentlyPlaying = musicData.currentlyPlaying; // Get currentlyPlaying data
    const row = document.createElement('tr');

    // Retrieve the song details using the songId
    const songDetails = musicData.available[currentlyPlaying.songId];

    const cells = [
        currentlyPlaying.songId,
        songDetails ? songDetails.song : 'N/A', // Display song URL or 'N/A' if not found
        formatTime(currentlyPlaying.currentTime), // Format currentTime
        formatTime(currentlyPlaying.maxTime) // Format maxTime
    ];
    cells.forEach(cellText => {
        const td = document.createElement('td');
        td.textContent = cellText;
        row.appendChild(td);
    });
    table.appendChild(row);

    // Clear existing content and append the new table
    currentlyPlayingSection.innerHTML = ''; // Clear any existing content
    currentlyPlayingSection.appendChild(table);
}

// Function to create the "Play" button and attach the event listener
function createPlayButton(songId) {
    const button = document.createElement('button');
    button.textContent = 'Play';
    button.style.padding = '5px 10px';
    button.style.backgroundColor = '#4B0082';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Add an event listener to the button
    button.addEventListener('click', async () => {
        await overrideSong(songId);
    });

    return button;
}

// Function to display the available music data in a table
function displayMusicData(musicData) {
    const musicList = document.getElementById('musicList');
    const table = document.createElement('table');

    // Create table header
    const headerRow = document.createElement('tr');
    const headers = ['Action', 'ID', 'Category', 'Song']; // Swapped Category and Song columns
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Create table rows for each song
    for (const [id, songDetails] of Object.entries(musicData.available)) {
        const row = document.createElement('tr');
        row.classList.add('music-item'); // Add class for styling

        // Create the Play button for this song
        const playButton = createPlayButton(id);
        const actionCell = document.createElement('td');
        actionCell.appendChild(playButton);
        row.appendChild(actionCell);

        // Create cells for each field in the song, with Category and Song columns swapped
        const cells = [
            id,
            songDetails.category || 'N/A', // Default to 'N/A' if category is not provided
            songDetails.song // Display song URL
        ];
        cells.forEach(cellText => {
            const td = document.createElement('td');
            td.textContent = cellText;
            row.appendChild(td);
        });
        table.appendChild(row);
    }

    // Clear existing content and append the table to the music list
    musicList.innerHTML = ''; // Clear any existing content
    musicList.appendChild(table);
}

// Main function to load and display music data
async function loadMusic() {
    const musicData = await fetchMusicData();
    if (musicData) {
        if (musicData.currentlyPlaying) {
            displayCurrentlyPlaying(musicData); // Display the currently playing data
        }
        if (musicData.available) {
            displayMusicData(musicData); // Display the available music data
        }
    }
}

// Function to send a POST request to override the currently playing song
async function overrideSong(songId) {
    try {
        const response = await fetch('/admin/music', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ override: songId }) // Send the song ID as an integer in the request body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log(`Successfully posted override song ID: ${songId}`);
    } catch (error) {
        console.error('Error posting override song:', error);
    }
}

// Handler to navigate the user to /admin
function navigateToAdmin() {
    window.location.href = '/admin';
}

// Load music data when the page loads and every second
window.onload = function () {
    loadMusic(); // Initial load of music data
    setInterval(loadMusic, 1000); // Fetch and update every second
};

// Add event listener for "Back to Menu" button
document.getElementById('backToMenuBtn').addEventListener('click', navigateToAdmin);