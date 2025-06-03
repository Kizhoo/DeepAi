// Load components
document.addEventListener('DOMContentLoaded', () => {
    // Load sidebar
    fetch('components/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
            initSidebar();
        });
    
    // Load chat header
    fetch('components/chat-header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('chat-header-container').innerHTML = data;
            initHeader();
        });
    
    // Load features panel
    fetch('components/features-panel.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('features-panel-container').innerHTML = data;
            loadFeatureCards();
        });
    
    // Initialize chat
    initChat();
});

// Load feature cards
function loadFeatureCards() {
    const features = [
        { icon: 'fas fa-code', name: 'Code Generation', desc: 'Generate code in any language, debug, explain, and optimize existing code' },
        { icon: 'fas fa-image', name: 'Image Creation', desc: 'Create images from text descriptions, edit existing images, generate variations' },
        { icon: 'fas fa-file-alt', name: 'Content Writing', desc: 'Write articles, blog posts, marketing copy, and creative content' },
        { icon: 'fas fa-chart-bar', name: 'Data Analysis', desc: 'Analyze datasets, create visualizations, and generate reports' },
        { icon: 'fas fa-language', name: 'Translation', desc: 'Translate text between 50+ languages with context awareness' },
        { icon: 'fas fa-book', name: 'Learning & Education', desc: 'Explain complex topics, create study guides, and generate quizzes' },
        { icon: 'fas fa-comments', name: 'Chatbot Development', desc: 'Design, develop and deploy AI-powered chatbots' },
        { icon: 'fas fa-music', name: 'Music & Audio', desc: 'Generate music, sound effects, and transcribe audio' },
        { icon: 'fas fa-video', name: 'Video Processing', desc: 'Analyze, summarize, and generate video content' },
        { icon: 'fas fa-robot', name: 'AI Agents', desc: 'Create autonomous AI agents to perform complex tasks' },
        { icon: 'fas fa-brain', name: 'Model Training', desc: 'Train custom AI models with your data' },
        { icon: 'fas fa-terminal', name: 'API Integration', desc: 'Connect to external services and APIs' }
    ];

    const featuresGrid = document.getElementById('featuresGrid');
    featuresGrid.innerHTML = '';
    
    features.forEach(feature => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.innerHTML = `
            <div class="feature-icon">
                <i class="${feature.icon}"></i>
            </div>
            <div class="feature-name">${feature.name}</div>
            <div class="feature-desc">${feature.desc}</div>
        `;
        featuresGrid.appendChild(card);
    });
}

// Initialize sidebar functionality
function initSidebar() {
    const newChatButton = document.getElementById('newChatButton');
    const historyList = document.getElementById('historyList');
    
    newChatButton.addEventListener('click', () => {
        document.querySelectorAll('.history-item').forEach(item => {
            item.classList.remove('active');
        });
        document.getElementById('chatTitle').textContent = 'New Chat';
        clearChat();
    });
    
    historyList.addEventListener('click', (e) => {
        const historyItem = e.target.closest('.history-item');
        if (historyItem) {
            document.querySelectorAll('.history-item').forEach(item => {
                item.classList.remove('active');
            });
            historyItem.classList.add('active');
            document.getElementById('chatTitle').textContent = historyItem.querySelector('span').textContent;
            loadChatHistory(historyItem.dataset.id);
        }
    });
}

// Initialize header functionality
function initHeader() {
    const toggleFeatures = document.getElementById('toggleFeatures');
    const closeFeatures = document.getElementById('closeFeatures');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.querySelector('.menu-toggle');
    const clearChat = document.getElementById('clearChat');
    const exportChat = document.getElementById('exportChat');
    
    toggleFeatures.addEventListener('click', () => {
        document.getElementById('featuresPanel').classList.toggle('open');
        overlay.classList.toggle('active');
    });
    
    closeFeatures.addEventListener('click', () => {
        document.getElementById('featuresPanel').classList.remove('open');
        overlay.classList.remove('active');
    });
    
    overlay.addEventListener('click', () => {
        document.getElementById('featuresPanel').classList.remove('open');
        overlay.classList.remove('active');
    });
    
    menuToggle.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('open');
        overlay.classList.toggle('active');
    });
    
    clearChat.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear this chat?')) {
            clearChat();
        }
    });
    
    exportChat.addEventListener('click', () => {
        exportChatToText();
    });
}

// Initialize main functionality
function initChat() {
    // Auto-resize textarea
    const textarea = document.querySelector('.message-input');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Simulate AI typing
    setInterval(() => {
        document.querySelectorAll('.typing-dot').forEach(dot => {
            dot.style.animation = 'none';
            setTimeout(() => {
                dot.style.animation = 'pulse 1.5s infinite';
            }, 10);
        });
    }, 3000);
    
    // Load initial chat messages
    loadInitialMessages();
    
    // Setup API status indicator
    createAPIStatusIndicator();
}

// Create API status indicator
function createAPIStatusIndicator() {
    const status = document.createElement('div');
    status.className = 'api-status';
    status.id = 'apiStatus';
    status.innerHTML = '<i class="fas fa-circle"></i> Groq API Connected';
    document.body.appendChild(status);
}

// Export chat to text file
function exportChatToText() {
    const messages = document.querySelectorAll('.message');
    let chatText = 'DeepAI Assistant Chat Export\n\n';
    
    messages.forEach(msg => {
        const sender = msg.querySelector('.message-sender').textContent;
        const content = msg.querySelector('.message-text').textContent;
        chatText += `${sender}: ${content}\n\n`;
    });
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deepai-chat-export.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
