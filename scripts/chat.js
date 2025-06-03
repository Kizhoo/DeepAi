// Initialize chat functionality
function initChat() {
    const chatContainer = document.getElementById('chatContainer');
    const textarea = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendButton');
    const inputTools = document.querySelector('.input-tools');
    
    // Load initial chat messages
    loadInitialMessages();
    
    // Send message functionality
    sendBtn.addEventListener('click', sendMessage);
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Feature buttons functionality
    inputTools.addEventListener('click', (e) => {
        const featureBtn = e.target.closest('.feature-btn');
        if (featureBtn) {
            const command = featureBtn.dataset.command;
            textarea.value = command + ' ';
            textarea.focus();
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        }
    });
    
    // Command suggestions
    textarea.addEventListener('input', () => {
        const value = textarea.value;
        if (value.startsWith('/')) {
            showCommandSuggestions(value);
        } else {
            hideCommandSuggestions();
        }
    });
}

// Load initial chat messages
function loadInitialMessages() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = `
        <div class="message ai-message">
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <div class="message-sender">DeepAI Assistant</div>
                    <div class="message-time">Just now</div>
                </div>
                <div class="message-text">
                    Hello! I'm your DeepAI Assistant powered by Groq API. I can help with code generation, image creation, content writing, data analysis, and much more. What would you like to accomplish today?
                </div>
                <div class="ai-tools">
                    <button class="tool-btn">
                        <i class="fas fa-thumbs-up"></i>
                        <span>Good Response</span>
                    </button>
                    <button class="tool-btn">
                        <i class="fas fa-thumbs-down"></i>
                        <span>Improve</span>
                    </button>
                    <button class="tool-btn">
                        <i class="fas fa-copy"></i>
                        <span>Copy</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add copy functionality
    addCopyFunctionality();
    
    // Scroll to bottom
    scrollToBottom();
}

// Show command suggestions
function showCommandSuggestions(input) {
    const commands = [
        { name: '/image [prompt]', desc: 'Generate an image from text description' },
        { name: '/code [language] [task]', desc: 'Generate code in specified language' },
        { name: '/content [topic]', desc: 'Create content on a specific topic' },
        { name: '/analyze [data]', desc: 'Analyze and visualize data' },
        { name: '/translate [text] to [language]', desc: 'Translate text to another language' },
        { name: '/summarize [text]', desc: 'Summarize long text content' }
    ];
    
    const filteredCommands = commands.filter(cmd => 
        cmd.name.toLowerCase().includes(input.toLowerCase())
    );
    
    let suggestionsHTML = '';
    filteredCommands.forEach(cmd => {
        suggestionsHTML += `
            <div class="command-suggestion" data-command="${cmd.name}">
                <strong>${cmd.name}</strong>
                <div>${cmd.desc}</div>
            </div>
        `;
    });
    
    const suggestionsContainer = document.getElementById('commandSuggestions');
    if (!suggestionsContainer) {
        const container = document.createElement('div');
        container.id = 'commandSuggestions';
        container.style.marginTop = '10px';
        container.innerHTML = suggestionsHTML;
        document.querySelector('.input-box').appendChild(container);
    } else {
        suggestionsContainer.innerHTML = suggestionsHTML;
    }
    
    // Add click event to suggestions
    document.querySelectorAll('.command-suggestion').forEach(suggestion => {
        suggestion.addEventListener('click', () => {
            document.getElementById('messageInput').value = suggestion.dataset.command + ' ';
            hideCommandSuggestions();
        });
    });
}

// Hide command suggestions
function hideCommandSuggestions() {
    const suggestions = document.getElementById('commandSuggestions');
    if (suggestions) {
        suggestions.remove();
    }
}

// Send message function
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    const chatContainer = document.getElementById('chatContainer');
    
    if (message) {
        // Add user message
        addUserMessageToChat(message);
        
        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';
        hideCommandSuggestions();
        
        // Add AI typing indicator
        const aiTypingElement = addAITypingIndicator();
        
        try {
            // Send to Groq API
            const response = await sendToGroqAPI(message);
            
            // Remove typing indicator
            aiTypingElement.remove();
            
            // Add AI response
            addAIResponseToChat(response);
            
        } catch (error) {
            // Remove typing indicator
            aiTypingElement.remove();
            
            // Show error message
            addAIErrorToChat(error);
        }
    }
}

// Add user message to chat
function addUserMessageToChat(content) {
    const chatContainer = document.getElementById('chatContainer');
    
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <div class="message-header">
                <div class="message-sender">You</div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
            <div class="message-text">${content}</div>
        </div>
    `;
    chatContainer.appendChild(userMessage);
    scrollToBottom();
}

// Add AI response to chat
function addAIResponseToChat(response) {
    const chatContainer = document.getElementById('chatContainer');
    
    const aiMessage = document.createElement('div');
    aiMessage.className = 'message ai-message';
    aiMessage.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-header">
                <div class="message-sender">DeepAI Assistant</div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
            <div class="message-text">${formatAIResponse(response)}</div>
            <div class="ai-tools">
                <button class="tool-btn like-btn">
                    <i class="fas fa-thumbs-up"></i>
                    <span>Good Response</span>
                </button>
                <button class="tool-btn improve-btn">
                    <i class="fas fa-thumbs-down"></i>
                    <span>Improve</span>
                </button>
                <button class="tool-btn copy-btn">
                    <i class="fas fa-copy"></i>
                    <span>Copy</span>
                </button>
            </div>
        </div>
    `;
    chatContainer.appendChild(aiMessage);
    
    // Add functionality to buttons
    aiMessage.querySelector('.like-btn').addEventListener('click', () => {
        alert('Thanks for your feedback!');
    });
    
    aiMessage.querySelector('.improve-btn').addEventListener('click', () => {
        const message = aiMessage.querySelector('.message-text').textContent;
        document.getElementById('messageInput').value = `Improve this: "${message}"`;
        document.getElementById('messageInput').focus();
    });
    
    aiMessage.querySelector('.copy-btn').addEventListener('click', function() {
        const text = aiMessage.querySelector('.message-text').textContent;
        navigator.clipboard.writeText(text);
        
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    });
    
    scrollToBottom();
}

// Add AI error to chat
function addAIErrorToChat(error) {
    const chatContainer = document.getElementById('chatContainer');
    
    const aiMessage = document.createElement('div');
    aiMessage.className = 'message ai-message';
    aiMessage.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-header">
                <div class="message-sender">DeepAI Assistant</div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
            <div class="message-text">
                <div style="color: ${'var(--danger)'}">
                    <i class="fas fa-exclamation-triangle"></i> Error: ${error.message || 'Failed to get response from AI'}
                </div>
                <p>Please try again or check your API connection.</p>
            </div>
        </div>
    `;
    chatContainer.appendChild(aiMessage);
    scrollToBottom();
    
    // Update API status
    const apiStatus = document.getElementById('apiStatus');
    apiStatus.innerHTML = '<i class="fas fa-circle"></i> Groq API Error';
    apiStatus.classList.add('error');
}

// Format AI response with proper formatting
function formatAIResponse(response) {
    // Format code blocks
    if (response.includes('```')) {
        return response.replace(/```(\w+)\n([\s\S]*?)```/g, (match, lang, code) => {
            return `
                <div class="code-block">
                    <div class="code-header">
                        <span>${lang}</span>
                        <button class="copy-btn">
                            <i class="fas fa-copy"></i>
                            Copy Code
                        </button>
                    </div>
                    <pre>${escapeHtml(code)}</pre>
                </div>
            `;
        });
    }
    
    // Format lists
    if (response.includes('- ') || response.includes('* ')) {
        const listItems = response.split('\n').map(line => {
            if (line.startsWith('- ') || line.startsWith('* ')) {
                return `<li>${line.substring(2)}</li>`;
            }
            return line;
        }).join('\n');
        
        return listItems.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    }
    
    return response;
}

// Escape HTML for code blocks
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Add AI typing indicator
function addAITypingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    
    const aiTyping = document.createElement('div');
    aiTyping.className = 'message ai-message';
    aiTyping.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="ai-typing">
                <span>Assistant is thinking</span>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    chatContainer.appendChild(aiTyping);
    scrollToBottom();
    
    return aiTyping;
}

// Clear chat
function clearChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    loadInitialMessages();
}

// Scroll to bottom of chat
function scrollToBottom() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Get current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// Panggil initChat saat halaman dimuat
document.addEventListener('DOMContentLoaded', initChat);
