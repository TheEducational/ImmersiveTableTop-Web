// Array to hold player data
let players = [
    { name: 'Joe', score: 0, avatar: 'test_picture.png' },
    { name: 'Adam', score: 0, avatar: 'test_picture.png' },
    { name: 'Stefan', score: 0, avatar: 'test_picture.png' },
    { name: 'Other Dude', score: 0, avatar: 'test_picture.png' },
    { name: 'Other Dude', score: 0, avatar: 'test_picture.png' },
    { name: 'Other Dude', score: 0, avatar: 'test_picture.png' },
    { name: 'Other Dude', score: 0, avatar: 'test_picture.png' },
    { name: 'Other Dude', score: 0, avatar: 'test_picture.png' },
    // { name: 'Other Dude', score: 0, avatar: 'test_picture.png' },
    // { name: 'Other Dude', score: 0, avatar: 'test_picture.png' },
    // { name: 'Other Dude', score: 0, avatar: 'test_picture.png' },
    // { name: 'Other Dude', score: 0, avatar: 'test_picture.png' },
    // { name: 'Other Dude', score: 0, avatar: 'test_picture.png' },
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
        //Create Player Info Container
        //These are the components that go into the individual leaderboard stats
        const playerCard = document.createElement('div');
        playerCard.classList.add('player-card');
        playerCard.dataset.name = player.name;

        const avatarImg = document.createElement('img');
        avatarImg.src = player.avatar;
        avatarImg.alt = 'Player Avatar';
        avatarImg.classList.add('avatar');
        //Add player Card
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player-info');
        // Add player name and current Score
        const playerName = document.createElement('h1');
        playerName.textContent = player.name;
        const playerScore = document.createElement('p');
        playerScore.textContent = `Score: ${player.score}`;

        playerCard.appendChild(avatarImg);
        playerCard.appendChild(playerInfo);
        playerInfo.appendChild(playerName);
        playerInfo.appendChild(playerScore);


        // Append the player card to the leaderboard
        leaderboardContainer.appendChild(playerCard);
    });

    updateLeaderboard();
});
