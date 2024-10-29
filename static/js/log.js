async function fetchAndDisplayLog() {
    try {
        const response = await fetch(logFileUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch log file");
        }
        
        const text = await response.text();
        // Split the text into lines, reverse the order, and join it back
        const reversedText = text.split('\n').reverse().join('\n');
        document.getElementById("logContainer").textContent = reversedText;
    } catch (error) {
        console.error("Error fetching log file:", error);
        document.getElementById("logContainer").textContent = "Unable to load log file.";
    }
}

// Handler to navigate the user to /admin
function navigateToAdmin() {
    window.location.href = '/admin';
}

// Add event listener for "Back to Menu" button
document.getElementById('backToMenuBtn').addEventListener('click', navigateToAdmin);

// Call the function when the page loads
window.onload = fetchAndDisplayLog;