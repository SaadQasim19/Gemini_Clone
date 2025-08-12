// Utility functions for the Gemini AI Clone project

// Function to format the current date and time
function formatDateTime(date) {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleString('en-US', options);
}

// Function to get a greeting based on the current time
    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) {
            return "Good morning";
        } else if (hour < 18) {
            return "Good afternoon";
        } else {
            return "Good evening";
        }
    }

// Function to save user data to local storage
function saveUserData(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Function to load user data from local storage
function loadUserData() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Function to clear user data from local storage
function clearUserData() {
    localStorage.removeItem('currentUser');
}

// Function to toggle dark mode
function toggleDarkMode(isDark) {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
}