document.getElementById("message-form").addEventListener("submit", sendMessage);

// Initialize an empty conversation array.
let conversation = [];

window.onload = function () {
  let initialMessage = {
    role: "system",
    content: "start",
  };
  conversation.push(initialMessage);
  fetchBotResponse();
};

function sendMessage(event) {
  event.preventDefault();

  const userInput = document.getElementById("userInput").value;

  // display user message
  addMessage("You", userInput, "user-prompt");
  conversation.push({
    role: "user",
    content: userInput,
  });

  fetchBotResponse();
  document.getElementById("chatHistory").style.display = "block";
  document.getElementById("userInput").value = "";
}

async function fetchBotResponse() {
  try {
    const response = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation }),
    });

    if (response.ok) {
      const { botResponse } = await response.json();

      // display bot response
      addMessage("SaltySapphire", botResponse, "bot-prompt");

      const newMessage = {
        role: "assistant",
        content: botResponse,
      };

      conversation.push(newMessage);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function addMessage(speaker, text, className) {
  const message = document.createElement("p");
  message.textContent = `${speaker}: ${text}`;
  message.classList.add(className);
  const hr = document.createElement("hr");

  const chatHistoryElement = document.getElementById("chatHistory");
  chatHistoryElement.appendChild(message);

  setTimeout(() => scrollToBottom("chatHistory"), 500);
}

function scrollToBottom(id) {
  const div = document.getElementById(id);
  div.scrollTop = div.scrollHeight;
}
