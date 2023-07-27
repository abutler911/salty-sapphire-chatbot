document.getElementById('message-form').addEventListener('submit', sendMessage)
let conversation = []

window.onload = function () {
  let initialMessage = {
    role: 'system',
    content: 'start',
  }
  conversation.push(initialMessage)
  fetchBotResponse()
}

function sendMessage(event) {
  event.preventDefault()

  const userInput = document.getElementById('userInput').value

  addMessage('You', userInput, 'user-prompt')
  conversation.push({
    role: 'user',
    content: userInput,
  })

  fetchBotResponse()
  document.getElementById('chatHistory').style.display = 'block'
  document.getElementById('userInput').value = ''
}

async function fetchBotResponse() {
  try {
    document.getElementById('typing-indicator').style.display = 'block'
    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    })

    document.getElementById('typing-indicator').style.display = 'none'

    if (response.ok) {
      const { botResponse } = await response.json()

      // display bot response
      addMessage('PopBot', botResponse, 'bot-prompt')

      const newMessage = {
        role: 'assistant',
        content: botResponse,
      }

      conversation.push(newMessage)
    } else {
      const { error } = await response.json()
      console.error('Server Error:', error)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

function addMessage(speaker, text, className) {
  const speakerElement = document.createElement('span')
  speakerElement.textContent = `${speaker}: `
  speakerElement.className = 'speaker'

  const message = document.createElement('p')

  message.appendChild(speakerElement)
  message.append(text)
  message.classList.add(className)

  const hr = document.createElement('hr')

  const chatHistoryElement = document.getElementById('chatHistory')
  chatHistoryElement.appendChild(message)
  4

  setTimeout(() => scrollToBottom('chatHistory'), 0)
}

function scrollToBottom(id) {
  const div = document.getElementById(id)
  div.scrollTop = div.scrollHeight
}
