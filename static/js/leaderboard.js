async function fetchData(file) {
    const response = await fetch(`/static/data/${file}`)
    const data = await response.json();
    return data
};

async function displayPlayers() {
    try {
        const data = await fetchData('players.json');
        numPlayers = data.length

        // Sort players by score, highest to lowest
        data.sort((a, b) => a.points - b.points);

        // Clear existing rows
        const tableBody = document.querySelector('#playerTable tbody');
        tableBody.innerHTML = '';

        // Create three rows: one for scores, one for avatars, and one for names
        const scoreRow = document.createElement('tr');
        const avatarRow = document.createElement('tr');
        const nameRow = document.createElement('tr');

        // Limit the data to numPlayers
        const limitedData = data.slice(0, numPlayers);

        var highScore = 0
        var topPlayers = []
        limitedData.forEach(player => {
            // Score cell
            const scoreCell = document.createElement('td');
            scoreCell.textContent = player.points;
            if (player.points > highScore) {
                highScore = player.points; // Update the highest score
                topPlayers.length = 0; // Clear the previous top players
                topPlayers.push(player.avatar); // Add the new top player
            } else if (player.score === highScore) {
                topPlayers.push(player.avatar); // Add the player in case of a tie
            }
            scoreRow.appendChild(scoreCell);

            // Avatar cell
            const avatarCell = document.createElement('td');
            const avatarImg = document.createElement('img');
            avatarImg.src = player.avatar;
            avatarImg.alt = `${player.name}'s Avatar`;
            avatarImg.classList.add('avatar'); // Add CSS class for styling
            avatarCell.appendChild(avatarImg);
            avatarRow.appendChild(avatarCell);

            // Name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = player.name;
            nameRow.appendChild(nameCell);
        });

        // If there are at least 4 people in a tie
        var newBorder
        if (topPlayers.length < 5) {
            if (topPlayers.length === 1){
                newBorder = "gold-border"
            } else {
                newBorder = "silver-border"
            }

            topPlayers.forEach(targetSrc => {
                // Find an image with the matching source in avatarRow, and give it a class that will outline its borders with either gold or silver
                const imgElement = avatarRow.querySelector(`img[src="${targetSrc}"]`);
                        
                if (imgElement) {
                    imgElement.classList.add(newBorder); // Apply the new class directly to the img tag
                }
            });
        }

        // Append the three rows to the table body
        tableBody.appendChild(scoreRow);
        tableBody.appendChild(avatarRow);
        tableBody.appendChild(nameRow);
    } catch (error) {
        console.error('Error fetching player data:', error);
    }
}

async function displayObjectives() {
    try {

        // Clear existing rows
        const objectivesTableBody = document.querySelector('#objectivesTable tbody');
        objectivesTableBody.innerHTML = '';

        objectives.forEach(objective => {
            const row = document.createElement('tr');

            const emptyCell = document.createElement('td'); // First column (empty)
            players.forEach(player => {
                // If the current objective in the for loop is in the players list of objectives, add their avatar to the cell
                if (player.objectives.includes(objective)){
                    const imgElement = document.createElement('img');
                    imgElement.src = player.avatar;
                    imgElement.classList.add('small-avatar');
                    emptyCell.appendChild(imgElement);
                }
            });

            const objectiveCell = document.createElement('td'); // Second column (objective)
            objectiveCell.style.textAlign = "left";
            objectiveCell.style.width = "60%";

            objectiveCell.textContent = objective;

            row.appendChild(emptyCell);
            row.appendChild(objectiveCell);

            objectivesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching objectives:', error);
    }
}

let objectives;
let players;

async function getData() {
    objectives = await fetchData('objectives.json');
    players = await fetchData('players.json');
}

// Continuously update players and objectives data
getData();
setInterval(getData, 10000);

// Fetch data initially and set an interval to continuously refresh the table
displayPlayers();
setInterval(displayPlayers, 10000);  // Fetch every 10 seconds

// Initial fetch and set interval for continuous fetching
displayObjectives();
setInterval(displayObjectives, 5000);