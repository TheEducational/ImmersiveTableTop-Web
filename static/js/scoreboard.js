// Array to hold player data
let players = [
    { name: "Player 1", score: 150, objectives: "Capture the flag" + "\n" + "Another Objective", avatar: "avatar1.png" },
    { name: "Player 2", score: 200, objectives: "Defend the base", avatar: "avatar2.png" },
    { name: "Player 3", score: 100, objectives: "Collect 10 items", avatar: "avatar3.png" },
    { name: "Player 4", score: 175, objectives: "Secure the area", avatar: "avatar4.png" },
    { name: "Player 5", score: 800, objectives: "Eat some Pickels", avatar: "avatar5.png" },
    { name: "Player 6", score: 266, objectives: "Take Out the Trash", avatar: "avatar5.png" },
    { name: "Player 7", score: 240, objectives: "Squeez a wet sock", avatar: "avatar5.png" },
    { name: "Player 8", score: 24, objectives: "Look at a rock ", avatar: "avatar5.png" },
    { name: "Player 9", score: 22, objectives: "Escort the train", avatar: "avatar5.png" },
    { name: "Player 10", score: 22, objectives: "Drink Some Water", avatar: "avatar5.png" },
];

// Function to generate a random player's score
function updatePlayerScore() {
    //The Math can be removed and replaced with static incomming values via fetch
    const playerScoreIndex = Math.floor(Math.random() * players.length);
    players[playerScoreIndex].score = newScore;
    //Grab the Score and update
    const scoreElement = document.getElementById('score');
    //If you want to set other valuse a modification might be needed below
    scoreElement.textContent = `${players[playerScoreIndex].name} Score: ${players[playerScoreIndex].score}`;
    //console.log(scoreElement)

    // Update the leaderboard reordering
    updateLeaderboard();
}
// Function to animate the leaderboard reordering
function updateLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard');
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

    // Rebuild the leaderboard
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

    // Calculate new positions and transition
    playerCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const initialTop = card.dataset.initialTop;
        const deltaY = initialTop - rect.top;

        // Apply the transform to move the element to its original position
        card.style.transition = 'none';
        card.style.transform = `translateY(${deltaY}px)`;

        // Trigger refactor
        card.getBoundingClientRect();

        // Apply the transition to move it to the new position smoothly
        //If you are making is quicker make sure this trasision alligns with the one listed in the css file under".playercard"
        card.style.transition = 'transform 1s ease';
        card.style.transform = 'translateY(0)';
    });
}

// Event listener for the refresh button
//document.getElementById('refreshButton').addEventListener('click', updatePlayerScore);

// Initial leaderboard display
document.addEventListener('DOMContentLoaded', () => {
    const leaderboardContainer = document.getElementById('leaderboard');
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


    updateLeaderboard();
});
