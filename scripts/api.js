// Groq API key
const API_KEY = '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';

// Send message to Groq API
async function sendToGroqAPI(message) {
    const apiStatus = document.getElementById('apiStatus');
    apiStatus.innerHTML = '<i class="fas fa-circle"></i> Connecting to Groq API...';
    
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI assistant that can do anything. Help the user with their requests. Always provide detailed and helpful responses.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        apiStatus.innerHTML = '<i class="fas fa-circle"></i> Groq API Connected';
        apiStatus.classList.remove('error');
        
        return data.choices[0].message.content;
    } catch (error) {
        apiStatus.innerHTML = '<i class="fas fa-circle"></i> Groq API Error';
        apiStatus.classList.add('error');
        throw error;
    }
}

// Function to generate images (simulated)
async function generateImage(prompt) {
    // In a real implementation, this would call an image generation API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                url: `https://source.unsplash.com/800x600/?${encodeURIComponent(prompt)}`,
                prompt: prompt
            });
        }, 1500);
    });
}
