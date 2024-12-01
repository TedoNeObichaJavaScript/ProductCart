// Simple scroll animation for header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.style.background = window.scrollY > 50 ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)';
});
// Words to cycle through
const words = ["Дискотеки", "Ресторанти", "Барове", "Магазини"];
let currentIndex = 0;

// Function to update the word
function updateWord() {
    const wordElement = document.getElementById("dynamic-word");
    // Fade out
    wordElement.style.opacity = 0;
    setTimeout(() => {
        // Change word
        wordElement.textContent = words[currentIndex];
        // Fade in
        wordElement.style.opacity = 1;
        // Update index
        currentIndex = (currentIndex + 1) % words.length;
    }, 600); // Matches the fade-out transition time
}

// Change word every 3 seconds
setInterval(updateWord, 3000);
