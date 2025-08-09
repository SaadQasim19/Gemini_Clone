//! Main JavaScript file for the Gemini AI Clone application
// State management
let currentUser = null;
let isDarkMode = false;
let conversationHistory = [];
let isTyping = false;

document.addEventListener('DOMContentLoaded', function() {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');
    
    // Load theme preference
    isDarkMode = localStorage.getItem('darkMode') === 'true';
    applyTheme();
    
    if (!savedUser) {
        // User not logged in, show auth screen
        if (authScreen) authScreen.style.display = 'flex';
        if (appContainer) appContainer.style.display = 'none';
        return;
    }
    
    // User is logged in, hide auth screen and show main app
    currentUser = savedUser;
    if (authScreen) authScreen.style.display = 'none';
    if (appContainer) appContainer.style.display = 'flex';
    
    // Update user info in sidebar
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    if (userName) userName.textContent = savedUser.name;
    if (userAvatar) userAvatar.textContent = savedUser.name.charAt(0).toUpperCase();
    
    // Load conversation history
    loadConversationHistory();
    
    // Show greeting after DOM is ready
    setTimeout(() => {
        showGreeting(savedUser);
    }, 100);
    
    // Initialize event listeners
    setupEventListeners();
});

function loadConversationHistory() {
    const saved = localStorage.getItem(`conversation_${currentUser.id}`);
    if (saved) {
        conversationHistory = JSON.parse(saved);
        displayConversationHistory();
    }
}

function saveConversationHistory() {
    localStorage.setItem(`conversation_${currentUser.id}`, JSON.stringify(conversationHistory));
}

function displayConversationHistory() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer || conversationHistory.length === 0) return;
    
    // Hide welcome screen if there are messages
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen && conversationHistory.length > 0) {
        welcomeScreen.style.display = 'none';
    }
    
    conversationHistory.forEach(msg => {
        addMessageToChat(msg.role, msg.content, msg.timestamp, false);
    });
}

function showGreeting(user) {
    const welcomeGreeting = document.getElementById('welcomeGreeting');
    if (!welcomeGreeting) {
        console.log('Welcome greeting element not found');
        return;
    }
    
    const currentHour = new Date().getHours();
    let greeting;
    
    if (currentHour < 12) {
        greeting = 'Good morning';
    } else if (currentHour < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }
    
    welcomeGreeting.textContent = `${greeting}, ${user.name}!`;
    console.log('Greeting set:', `${greeting}, ${user.name}!`);
}
