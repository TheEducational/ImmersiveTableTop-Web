async function loadJsonFile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
            return data;
        } else {
            throw new Error('Data is not an array');
        }
    } catch (error) {
        console.error('Error loading JSON file:', error);
    }
}

let players = []; // Array to hold player data
let objectivesList = []; // Array to hold the list of objectives

function createTable(dataArray) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear existing table

    const table = document.createElement('table');
    table.setAttribute('border', '1');

    const headerRow = document.createElement('tr');
    const headers = ['Name', 'Faction', 'Score', 'Objectives', 'Actions']; // Added Actions header
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    dataArray.forEach((player, index) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = player.name || 'New Player'; // Default name
        row.appendChild(nameCell);

        const factionCell = document.createElement('td');
        factionCell.textContent = player.avatar.split('/').pop().split('.')[0];
        row.appendChild(factionCell)

        const pointsCell = document.createElement('td');
        pointsCell.textContent = player.points || 0; // Default points
        row.appendChild(pointsCell);

        const playerObjectivesArray = player.objectives;
        const objectivesCell = document.createElement('td');
        objectivesCell.innerHTML = (playerObjectivesArray || []).join('<br>'); // Objectives delimited by new lines
        row.appendChild(objectivesCell);

        const actionsCell = document.createElement('td'); // Create actions cell

        // Remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removePlayer(index); // Bind the removePlayer function
        actionsCell.appendChild(removeButton);

        // Change Name button
        const changeNameButton = document.createElement('button');
        changeNameButton.textContent = 'Change Name';
        changeNameButton.onclick = () => changePlayerName(index); // Bind the changePlayerName function
        actionsCell.appendChild(changeNameButton);

        // Change points button
        const changepointsButton = document.createElement('button');
        changepointsButton.textContent = 'Change Score';
        changepointsButton.onclick = () => changePlayerPoints(index); // Bind the changePlayerPoints function
        actionsCell.appendChild(changepointsButton);

        // Add Objective button
        const changeObjectivesButton = document.createElement('button');
        changeObjectivesButton.textContent = 'Change Objectives';
        changeObjectivesButton.onclick = () => changeObjectives(index); // Bind the changeObjectives function
        actionsCell.appendChild(changeObjectivesButton);

        // Add Secret Objective button
        const addSecretObjectiveButton = document.createElement('button');
        addSecretObjectiveButton.textContent = 'Add Secret Objective';
        addSecretObjectiveButton.onclick = () => addSecretObjective(index); // Bind the addSecretObjective function
        actionsCell.appendChild(addSecretObjectiveButton);

        row.appendChild(actionsCell);

        table.appendChild(row);
    });

    tableContainer.appendChild(table);
}

function addNewPlayer() {
    // List of all factions
    const avatarOptions = [
    "arborec", "argent", "cabal", "creuss", "empyrean", "hacan", 
    "jolnar", "l1", "letnev", "mahact", "mentak", "muaat", 
    "naalu", "nekro", "nomad", "rokha", "saar", "sardakk", 
    "sol", "titans", "winnu", "xxcha", "yin", "yssaril"
    ]
    let avatar;

    // Prompt the user until they select a valid avatar
    do {
        avatar = prompt(`Enter the players faction:\n${avatarOptions.join("\n")}`);
        if (!avatarOptions.includes(avatar)) {
            alert("Invalid choice. Select one of the listed factions.");
        }
    } while (!avatarOptions.includes(avatar));

    // Create the new player object with the chosen avatar
    const newPlayer = {
        name: `Player ${players.length + 1}`, // Default name
        points: 0, // Default points
        objectives: [], // No objectives
        avatar: `/static/UI/${avatar}.png` // Chosen avatar
    };

    players.push(newPlayer); // Add the new player to the array
    createTable(players); // Refresh the table with the new player
    saveDataToJson(); // Save updated data back to JSON file
}

function removePlayer(index) {
    const confirmRemove = confirm('Are you sure you want to remove this player?');
    if (confirmRemove) {
        players.splice(index, 1); // Remove the player from the array
        createTable(players); // Refresh the table
        saveDataToJson(); // Save updated data back to JSON file
    }
}

function changePlayerName(index) {
    const newName = prompt('Enter the new name for the player:', players[index].name);
    if (newName) {
        players[index].name = newName; // Update the player's name
        createTable(players); // Refresh the table
        saveDataToJson(); // Save updated data back to JSON file
    }
}

function changePlayerPoints(index) {
    const newPoints = prompt('Enter the new score for the player:', players[index].points);
    if (newPoints !== null) {
        const parsedPoints = parseInt(newPoints, 10); // Parse the input to an integer
        if (!isNaN(parsedPoints)) {
            players[index].points = parsedPoints; // Update the player's points
            createTable(players); // Refresh the table
            saveDataToJson(); // Save updated data back to JSON file
        } else {
            alert('Please enter a valid number.'); // Validation message
        }
    }
}

function changeObjectives(index) {
    if (objectivesList.length === 0) {
        alert('No objectives available to add.');
        return;
    }

    // Get the modal elements
    const modal = document.getElementById('objective-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');
    
    // Clear any existing content in the modal body
    modalBody.innerHTML = '';

    // Create a container for the two columns
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'space-between';

    // Left column for available objectives
    const availableColumn = document.createElement('div');
    availableColumn.style.width = '48%'; // Adjust width as needed
    availableColumn.innerHTML = '<h3>Available Objectives</h3>'; // Column title

    // Create a list of objectives with a select button for each
    objectivesList.forEach((objective, i) => {
        const objectiveItem = document.createElement('div');
        objectiveItem.classList.add('objective-item');
        
        // Create the objective text
        const objectiveText = document.createElement('span');
        objectiveText.textContent = objective;
        objectiveItem.appendChild(objectiveText);
        
        // Create the select button
        const selectButton = document.createElement('button');
        selectButton.textContent = 'Select';
        selectButton.setAttribute('data-index', i);
        objectiveItem.appendChild(selectButton);
        
        // Append this item to the available column
        availableColumn.appendChild(objectiveItem);

        // Add event listener to handle selection
        selectButton.addEventListener('click', function () {
            const selectedIndex = parseInt(this.getAttribute('data-index'), 10);
            if (selectedIndex >= 0 && selectedIndex < objectivesList.length) {
                players[index].objectives.push(objectivesList[selectedIndex]); // Add the selected objective to the player
                createTable(players); // Refresh the table
                saveDataToJson(); // Save updated data back to JSON file
            }
            modal.style.display = 'none'; // Close the modal after selection
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    });

    // Right column for existing objectives
    const existingColumn = document.createElement('div');
    existingColumn.style.width = '48%'; // Adjust width as needed
    existingColumn.innerHTML = '<h3>Existing Objectives</h3>'; // Column title

    // Display existing objectives of the player with remove buttons
    const playerObjectives = players[index].objectives;
    playerObjectives.forEach((objective, i) => {
        const existingObjectiveItem = document.createElement('div');
        existingObjectiveItem.classList.add('objective-item');

        // Create the existing objective text
        const existingObjectiveText = document.createElement('span');
        existingObjectiveText.textContent = objective;
        existingObjectiveItem.appendChild(existingObjectiveText);
        
        // Create the remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => {
            players[index].objectives.splice(i, 1); // Remove the objective from the player's objectives
            createTable(players); // Refresh the table
            saveDataToJson(); // Save updated data back to JSON file
            modal.style.display = 'none'; // Close the modal after removal
        };
        existingObjectiveItem.appendChild(removeButton);

        // Append this item to the existing column
        existingColumn.appendChild(existingObjectiveItem);
    });

    // Append both columns to the container
    container.appendChild(availableColumn);
    container.appendChild(existingColumn);
    modalBody.appendChild(container);

    // Display the modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Disable scrolling when modal is open

    // Handle modal close button
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    });

    // Close the modal if user clicks outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    };
}

function addSecretObjective(index) {
    // Prompt the user for the secret objective's name
    var objectiveName = prompt('Enter the secret objective condition:');
    
    // Add the secret objective to the player's objectives list
    players[index].objectives.push(`${objectiveName} (I) (Secret)`);
    
    // Refresh the table to reflect the changes
    createTable(players);
    
    // Save the updated players array to JSON
    saveDataToJson();
}

async function saveDataToJson() {
    try {
        const response = await fetch('/admin/players', { // Send to /admin/players
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(players) // Send the updated players array
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message); // Log success message
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Handler to navigate the user to /admin
function navigateToAdmin() {
    window.location.href = '/admin';
}

// Load player data from JSON file
loadJsonFile(playersFileUrl).then(dataArray => { // Load from /admin/players
    if (dataArray) {
        players = dataArray; // Store the loaded data in the players array
        createTable(players); // Create and populate the table
    }
});

// Load available public objectives from JSON file
objectivesList = loadJsonFile(objectivesFileUrl).then(data => {
    objectivesList = data;
});

// Add event listener for "Add player" button
document.getElementById('addPlayerBtn').addEventListener('click', addNewPlayer);

// Add event listener for "Back to Menu" button
document.getElementById('backToMenuBtn').addEventListener('click', navigateToAdmin);