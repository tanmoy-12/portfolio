document.addEventListener('DOMContentLoaded', () => {
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const loader = document.getElementById('loader');

    // Toggle chatbot window visibility
    chatbotButton.addEventListener('click', () => {
        chatbotWindow.style.display = chatbotWindow.style.display === 'none' || chatbotWindow.style.display === '' ? 'block' : 'none';
    });

    // Handle sending message
    sendButton.addEventListener('click', async () => {
        const prompt = userInput.value.trim();
        if (prompt) {
            // Display user message
            addMessage('user', prompt);

            // Show loader and hide send button
            loader.style.display = 'block';
            sendButton.style.display = 'none';

            // Fetch generated content
            try {
                // const response = await fetch('http://localhost:3000/generate', {
                const response = await fetch(' https://d506-110-224-22-104.ngrok-free.app/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt }),
                });

                const data = await response.json();
                loader.style.display = 'none'; // Hide loader
                sendButton.style.display = 'block'; // Show send button

                const formattedText = formatBotResponse(data.text);
                addMessage('bot', formattedText);

            } catch (error) {
                console.error('Error fetching generated content:', error);
                loader.style.display = 'none'; // Hide loader
                sendButton.style.display = 'block'; // Show send button
                addMessage('bot', 'Error: Unable to fetch response.');
            }

            // Clear input field
            userInput.value = '';
        }
    });

    // Function to add messages to the chat window
    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        const textElement = document.createElement('div');
        textElement.className = 'text';
        textElement.innerHTML = message;
        messageElement.appendChild(textElement);
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to the bottom
    }

    // Function to format bot response
    function formatBotResponse(text) {
        // Remove single * or # characters
        text = text.replace(/[#]/g, '');

        // Replace **text** with <b>text</b> and insert a line break after the bold text
        text = text.replace(/\*\*(.*?)\*\*/g, '<br><b>$1</b>');
        text = text.replace(/[*]/g, '');

        return text;
    }
});
