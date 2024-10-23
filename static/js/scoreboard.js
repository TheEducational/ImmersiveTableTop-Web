//Set the Default Array
let players = []
let previousPlayersData = [];
async function fetchPlayersData() {

    try {
        const response = await fetch('../static/data/players.json'); // Replace with actual path to your JSON file

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Automatically convert the response into a JavaScript array using .json()
        players = await response.json();
        players = data.sort((a, b) => b.score - a.score);
        console.log(players.length)
        console.log(players)

        previousPlayersData = JSON.parse(JSON.stringify(players));


        console.log('Query fetched and converted to array:', players);
        updateLeaderboard()
            // return players
            // Now that the array is ready, update the leaderboard
            ;
    } catch (error) {
        console.error('Players Updated');
    }

}
//Function To Update the Leaderboard
function updateLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard');
    //Clears the Player Container So Duplicates Dont Appear
    leaderboardContainer.innerHTML = '';
    //If No Users Print Error
    if (players.length === 0) {
        console.error('Player array is empty. Cannot update leaderboard.');
        return;
    }
    // console.log(players)

    //Create The Player Card For Each User
    players.forEach(player => {
        // Create Player Info Container
        const playerCard = document.createElement('div');
        playerCard.className = "player-card";
        playerCard.dataset.name = player.name;

        // Create the Avatar
        const avatarImg = document.createElement('img');
        avatarImg.src = player.avatar;
        avatarImg.classList.add('avatar');

        // Create Player Name
        const playerName = document.createElement('p');
        playerName.textContent = player.name;
        playerName.classList.add('player-name'); // Add class for styling

        // Create player info (score and objectives)
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player-info');

        const playerScore = document.createElement('p');
        playerScore.textContent = `Score: ${player.score}`;

        const playerObjective = document.createElement('p')
        playerObjective.textContent = `Objective ${player.objectives}`

        // Append avatar and name to the player card
        playerCard.appendChild(avatarImg);
        playerCard.appendChild(playerName);

        // Append player info (score) to the player card
        playerInfo.appendChild(playerScore);
        playerInfo.appendChild(playerObjective)
        playerCard.appendChild(playerInfo);

        // Append the player card to the leaderboard
        leaderboardContainer.appendChild(playerCard);
    });
    const playerCards = Array.from(leaderboardContainer.children);
    const containerHeight = leaderboardContainer.clientHeight;

    // Calculate the height each player card should take (e.g., leaving 5px gap between cards)
    const cardHeight = (containerHeight - (players.length - 5) * 5) / players.length;

    // Store the initial positions of all player cards
    playerCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        card.dataset.initialTop = rect.top;
    });

    // Sort players by score in descending order
    players.sort((a, b) => b.score - a.score);

    // Get the highest score
    const topScore = players[0].score;

    // Check if there's a tie for the topscore
    const isTie = players.filter(player => player.score === topScore).length > 1;


    // Rebuild the leaderboard Using the Correct Highlighting
    players.forEach((player, index) => {
        const playerCard = playerCards.find(card => card.dataset.name === player.name);
        playerCard.style.height = `${cardHeight}px`;
        const playerScore = playerCard.querySelector('.player-info p');
        playerScore.textContent = `Score: ${player.score}`;
        // Remove Both Boarders
        if (player.score === 0 && isTie) {
            playerCard.classList.remove('highlighted');
            playerCard.classList.remove('tied');


        }
        //Apply Gold Boarder
        else if (index === 0 && !isTie) {
            playerCard.classList.add('highlighted');
            playerCard.classList.remove('tied');

        }
        //Apply Silver Boarder and remove gold
        else if (player.score === topScore) {
            playerCard.classList.add('tied');
            playerCard.classList.remove('highlighted');
            //console.log(player)

        }
        else {
            //Remove Both Boarders
            playerCard.classList.remove('highlighted');
            playerCard.classList.remove('tied');
        }

        // reordered playerCard back to the leaderboard this will not cause the refactor
        leaderboardContainer.appendChild(playerCard);
    });
    animatePlayerCards()
    // Calculate new positions and transition

}
//When a Change is updated on the JSON This will check the new score agains the old score. If the Score is the same no change if the score changes Change the users "currentRank"
function animatePlayerCards() {
    let playerCards = document.querySelectorAll('.player-card');  // Ensure it's scoped to this function

    playerCards.forEach(card => {
        const playerName = card.dataset.name;
        const currentPlayer = players.find(p => p.name === playerName);
        const previousPlayer = previousPlayersData.find(p => p.name === playerName);

        if (!previousPlayer) {
            console.error(`Previous player data not found for ${playerName}`);
            return;
        }

        // Compare the current and previous scores
        if (currentPlayer && (currentPlayer.score !== previousPlayer.score || currentPlayer.currentRank !== previousPlayer.currentRank)) {
            const rect = card.getBoundingClientRect();
            const initialTop = card.dataset.initialTop;
            //If No Change to The Top Return No Change
            if (!initialTop) return;

            const deltaY = initialTop - rect.top;  // Calculate the difference in positions

            // Apply the transform to move the element to its original position
            card.style.transition = 'none';
            card.style.transform = `translateY(${deltaY}px)`;

            // Trigger refactor
            card.getBoundingClientRect();  // Forces reflow, required for smooth transition

            // Apply the transition to move it to the new position smoothly
            card.style.transition = 'transform 2s ease';
            card.style.transform = 'translateY(0)';
        }
    });

    // Update previous player data after animation
    previousPlayersData = JSON.parse(JSON.stringify(players));
}
//MAIN FUNCTION TO UPDATE LEADERBOARD
function refreshLeaderboard() {
    fetchPlayersData().then(() => {
        updateLeaderboard();
    });
}
// Initialize leaderboard  DOM Content
document.addEventListener('DOMContentLoaded', () => {
    const leaderboardContainer = document.getElementById('leaderboard');
    refreshLeaderboard();
});
