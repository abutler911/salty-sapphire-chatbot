// Cache DOM elements for better performance
const chatHistoryElement = document.getElementById('chatHistory')
const userInputEl = document.getElementById('userInput')
const typingIndicatorEl = document.getElementById('typing-indicator')
const messageFormEl = document.getElementById('message-form')

// Set up the initial conversation state
let conversation = []

// Add initial system message to the conversation when the window loads
window.onload = () => {
  addInitialSystemMessage()
  fetchBotResponse()
}

// Handle the message form submission
messageFormEl.addEventListener('submit', sendMessage)

function addInitialSystemMessage() {
  const initialMessage = {
    role: 'system',
    content: 'start',
  }
  conversation.push(initialMessage)
  addMessage('System', 'Chat started.', 'system-prompt')
}

function sendMessage(event) {
  event.preventDefault()
  const userInput = userInputEl.value.trim()
  if (userInput) {
    addMessage('You', userInput, 'user-prompt')
    conversation.push({
      role: 'user',
      content: userInput,
    })
    fetchBotResponse()
    chatHistoryElement.style.display = 'block'
    userInputEl.value = ''
  }
}

async function fetchBotResponse() {
  typingIndicatorEl.style.display = 'block'
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    })
    typingIndicatorEl.style.display = 'none'

    if (response.ok) {
      const { botResponse } = await response.json()
      addMessage('PopBot', botResponse, 'bot-prompt')
      conversation.push({
        role: 'assistant',
        content: botResponse,
      })
    } else {
      // Handle non-OK responses
      addMessage(
        'System',
        'An error occurred. Please try again later.',
        'error-prompt',
      )
    }
  } catch (error) {
    // Handle errors from the fetch operation itself
    console.error('Fetch Error:', error)
    addMessage(
      'System',
      'A network error occurred. Please check your connection.',
      'error-prompt',
    )
  }
}

function addMessage(speaker, text, className) {
  const speakerElement = document.createElement('span')
  speakerElement.textContent = `${speaker}: `
  speakerElement.className = 'speaker'

  const messageElement = document.createElement('p')
  messageElement.appendChild(speakerElement)
  messageElement.append(text)
  messageElement.classList.add(className)

  chatHistoryElement.appendChild(messageElement)

  // Scroll to the bottom of the chat history after the message is added
  scrollToBottom()
}

function scrollToBottom() {
  // Use requestAnimationFrame for performance reasons
  requestAnimationFrame(() => {
    chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight
  })
}
