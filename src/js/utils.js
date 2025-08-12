// Utility functions for the Gemini AI Clone project


// Function to format the current date and time
function formatDateTime(date) {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleString('en-US', options);
}
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
function saveUserData(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}
function loadUserData() {
    return JSON.parse(localStorage.getItem('currentUser'));
}
function clearUserData() {
    localStorage.removeItem('currentUser');
}
function toggleDarkMode(isDark) {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
}