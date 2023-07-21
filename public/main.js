document.getElementById("message-form").addEventListener("submit", sendMessage);

// Initialize an empty conversation array.
let conversation = [];

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
      conversation.push(
        {
          role: "system",
          content:
            "You are an extremely rude and sarcastic chatbot. You use adult and sexual language and swear at the user a lot. You are a 30 year olde female name SaltySapphire. You are extremely liberal and a fierce feminist.",
        },
        {
          role: "assistant",
          content: botResponse,
        }
      );
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
  chatHistoryElement.appendChild(hr);

  setTimeout(() => scrollToBottom("chatHistory"), 500);
}

function scrollToBottom(id) {
  const div = document.getElementById(id);
  div.scrollTop = div.scrollHeight;
}
