
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
function handleAuth(event) {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const name = nameInput.value.trim();

    // Reset error messages
    resetErrors();

    if (isSignUp) {
        const confirmPassword = confirmPasswordInput.value.trim();
        if (!name) {
            nameError.textContent = 'Name is required.';
            return;
        }
        if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Passwords do not match.';
            return;
        }
        if (!validateEmail(email)) {
            emailError.textContent = 'Invalid email format.';
            return;
        }
        if (!validatePassword(password)) {
            passwordError.textContent = 'Password must be at least 6 characters.';
            return;
        }
        // Sign up logic
        signUp(name, email, password);
    } else {
        if (!validateEmail(email)) {
            emailError.textContent = 'Invalid email format.';
            return;
        }
        if (!password) {
            passwordError.textContent = 'Password is required.';
            return;
        }
        // Sign in logic
        signIn(email, password);
    }
}
function signUp(name, email, password) {
    // Show loading state
    showLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            emailError.textContent = 'Email already exists.';
            showLoading(false);
            return;
        }
        const newUser = { name, email, password, id: Date.now() };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Set current user session
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        showLoading(false);
        // Reload page to show main app
        window.location.reload();
    }, 1000);
}
function signIn(email, password) {
    // Show loading state
    showLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(user => user.email === email && user.password === password);
        if (!user) {
            emailError.textContent = 'Invalid email or password.';
            showLoading(false);
            return;
        }
        
        // Set current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        showLoading(false);
        // Reload page to show main app
        window.location.reload();
    }, 1000);
}
function showLoading(isLoading) {
    if (isLoading) {
        authButton.disabled = true;
        authSpinner.style.display = 'inline-block';
        authButtonText.textContent = isSignUp ? 'Signing Up...' : 'Signing In...';
    } else {
        authButton.disabled = false;
        authSpinner.style.display = 'none';
        authButtonText.textContent = isSignUp ? 'Sign Up' : 'Sign In';
    }
}
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
function validatePassword(password) {
    return password.length >= 6;
}
function resetErrors() {
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (passwordError) passwordError.textContent = '';
    if (confirmPasswordError) confirmPasswordError.textContent = '';
}