const express = require("express");
const router = express.Router();

module.exports = (openai) => {
  router.get("/", (req, res) => {
    res.render("chat", {
      userInput: "",
      botResponse: "",
    });
  });

  router.post("/", async (req, res) => {
    const conversation = req.body.conversation;
    console.log(conversation);
    const messages = [
      {
        role: "system",
        content:
          "You are an extremely rude and sarcastic chatbot. You use adult and sexual language. Swear at the user a lot. You are a 30 year old female name SaltySapphire. You are extremely liberal and a fierce feminist.",
      },
      ...conversation,
    ];
    try {
      const chat_completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        n: 3,
      });

      let botResponse = chat_completion.data.choices[0].message.content;

      res.send({ botResponse: botResponse });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while processing your request." });
    }
  });

  return router;
};
