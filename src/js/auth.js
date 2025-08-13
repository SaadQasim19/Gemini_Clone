
const authForm = document.getElementById('authForm');
const authButton = document.getElementById('authButton');
const authButtonText = document.getElementById('authButtonText');
const authSpinner = document.getElementById('authSpinner');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

let isSignUp = false;

if (authForm) {
    authForm.addEventListener('submit', handleAuth);
}
// Toggle between sign-up and login mode
function toggleAuthMode() {
    isSignUp = !isSignUp;
    const nameGroup = document.getElementById('nameGroup');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    const switchButton = document.getElementById('switchButton');
    const switchText = document.getElementById('switchText');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    
    if (isSignUp) {
        authButtonText.textContent = 'Sign Up';
        nameGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'block';
        switchText.textContent = 'Already have an account?';
        switchButton.textContent = 'Sign In';
        authTitle.textContent = 'Create Account';
        authSubtitle.textContent = 'Sign up to get started';
    } else {
        authButtonText.textContent = 'Sign In';
        nameGroup.style.display = 'none';
        confirmPasswordGroup.style.display = 'none';
        switchText.textContent = "Don't have an account?";
        switchButton.textContent = 'Sign Up';
        authTitle.textContent = 'Welcome to Gemini';
        authSubtitle.textContent = 'Sign in to continue';
    }
}