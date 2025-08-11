// Utility functions for the Gemini AI Clone project


// Function to format the current date and time
function formatDateTime(date) {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleString('en-US', options);
}