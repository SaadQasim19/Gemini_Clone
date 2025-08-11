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

function setupEventListeners() {
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-open');
        });
    }
    
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            const action = this.getAttribute('data-action');
            handleNavigation(action);
        });
    });
    
    // File upload
    const fileButton = document.getElementById('fileButton');
    const fileInput = document.getElementById('fileInput');
    if (fileButton && fileInput) {
        fileButton.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Message input and send button
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    if (messageInput && sendButton) {
        // Initialize send button state
        sendButton.disabled = !messageInput.value.trim();
        
        messageInput.addEventListener('input', function() {
            autoResize();
            // Enable/disable send button based on input
            sendButton.disabled = !this.value.trim();
        });
        
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        sendButton.addEventListener('click', sendMessage);
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    applyTheme();
    
    // Update theme toggle text
    const themeToggle = document.getElementById('themeToggle');
    const themeText = themeToggle.querySelector('.nav-text');
    const themeIcon = themeToggle.querySelector('.nav-icon');
    
    if (themeText && themeIcon) {
        if (isDarkMode) {
            themeText.textContent = 'Light Mode';
            themeIcon.textContent = '☀️';
        } else {
            themeText.textContent = 'Dark Mode';
            themeIcon.textContent = '🌙';
        }
    }
}

function applyTheme() {
    document.body.classList.toggle('dark-mode', isDarkMode);
}

function handleNavigation(action) {
    const messagesContainer = document.getElementById('messagesContainer');
    
    switch (action) {
        case 'new-chat':
            // Clear messages and show welcome screen
            conversationHistory = [];
            saveConversationHistory();
            if (messagesContainer) {
                messagesContainer.innerHTML = `
                    <div class="welcome-screen" id="welcomeScreen">
                        <div class="welcome-logo">G</div>
                        <h2 class="welcome-greeting" id="welcomeGreeting"></h2>
                        <p class="welcome-subtitle">How can I help you today?</p>
                    </div>
                `;
                setTimeout(() => {
                    showGreeting(currentUser);
                }, 50);
            }
            break;
        case 'history':
            loadChatHistory();
            break;
        case 'recent':
            loadRecentChats();
            break;
        case 'settings':
            showSettings();
            break;
    }
}

function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    const attachedFiles = document.getElementById('attachedFiles');
    
    if (attachedFiles) {
        files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.className = 'attached-file';
            fileElement.innerHTML = `
                <span class="file-name">${file.name}</span>
                <button class="remove-file" onclick="removeFile(this)">×</button>
            `;
            attachedFiles.appendChild(fileElement);
        });
    }
    
    event.target.value = '';
}

function removeFile(button) {
    button.parentElement.remove();
}

function autoResize() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    }
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const message = messageInput.value.trim();
    
    if (!message || isTyping) return;
    
    sendButton.disabled = true;
    isTyping = true;
    
    // Add user message to chat
    const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
    };
    
    conversationHistory.push(userMessage);
    addMessageToChat('user', message, userMessage.timestamp);
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Hide welcome screen
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
    
    // Clear attached files
    const attachedFiles = document.getElementById('attachedFiles');
    if (attachedFiles) {
        attachedFiles.innerHTML = '';
    }
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get AI response
        const response = await getAIResponse(message);
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add AI response to chat
        const aiMessage = {
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString()
        };
        
        conversationHistory.push(aiMessage);
        addMessageToChat('ai', response, aiMessage.timestamp);
        
        // Save conversation
        saveConversationHistory();
        
    } catch (error) {
        hideTypingIndicator();
        addMessageToChat('ai', 'Sorry, I encountered an error. Please try again.', new Date().toISOString());
    }
    
    isTyping = false;
    sendButton.disabled = !messageInput.value.trim();
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message ai-message typing-indicator';
    typingIndicator.id = 'typingIndicator';
    
    typingIndicator.innerHTML = `
        <div class="message-avatar">G</div>
        <div class="message-content">
            <div class="message-text">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Fixed getAIResponse function with proper error handling
async function getAIResponse(message) {
    const API_KEY = 'AIzaSyB-6-K2vXTu7vG6JW34IRrdGSAgDdLoOR8';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if the response has the expected structure
        if (data.candidates && data.candidates.length > 0 && 
            data.candidates[0].content && data.candidates[0].content.parts && 
            data.candidates[0].content.parts.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid response structure from API');
        }
        
    } catch (error) {
        console.error('AI API Error:', error);
        
        // Fallback to mock responses if API fails
        const mockResponses = [
            "I'm here to help! What specific information are you looking for?",
            "That's an interesting question. Let me think about that...",
            "I'd be happy to assist you with that. Could you provide more details?",
            "Great question! Here's what I can tell you about that topic...",
            "I understand what you're asking. Let me provide a comprehensive answer."
        ];
        
        // Simple pattern matching for better mock responses
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! I'm Gemini, your AI assistant. How can I help you today?";
        }
        
        if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
            return "I can help you with coding! What programming language or concept would you like to explore?";
        }
        
        if (lowerMessage.includes('?')) {
            return "That's a great question! " + mockResponses[Math.floor(Math.random() * mockResponses.length)];
        }
        
        return mockResponses[Math.floor(Math.random() * mockResponses.length)] + 
               `\n\nRegarding "${message}", I'd be happy to help you explore this topic further!`;
    }
}
function addMessageToChat(sender, message, timestamp, save = true) {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    const avatar = sender === 'user' ? 
        (currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U') : 'G';
    
    const timeString = timestamp ? new Date(timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
    
    messageElement.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text">${message}</div>
            <div class="message-time">${timeString}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function loadChatHistory() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (messagesContainer) {
        messagesContainer.innerHTML = `
            <div class="content-section">
                <h3>Chat History</h3>
                <div class="history-list">
                    ${conversationHistory.length > 0 ? 
                        conversationHistory.map(msg => `
                            <div class="history-item">
                                <strong>${msg.role === 'user' ? 'You' : 'Gemini'}:</strong> 
                                ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}
                                <small>${new Date(msg.timestamp).toLocaleString()}</small>
                            </div>
                        `).join('') : 
                        '<p>No chat history available.</p>'
                    }
                </div>
            </div>
        `;
    }
}

function loadRecentChats() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (messagesContainer) {
        const recentMessages = conversationHistory.slice(-10);
        messagesContainer.innerHTML = `
            <div class="content-section">
                <h3>Recent Conversations</h3>
                <div class="recent-list">
                    ${recentMessages.length > 0 ? 
                        recentMessages.map(msg => `
                            <div class="recent-item">
                                <strong>${msg.role === 'user' ? 'You' : 'Gemini'}:</strong> 
                                ${msg.content}
                                <small>${new Date(msg.timestamp).toLocaleString()}</small>
                            </div>
                        `).join('') : 
                        '<p>No recent conversations available.</p>'
                    }
                </div>
            </div>
        `;
    }
}
