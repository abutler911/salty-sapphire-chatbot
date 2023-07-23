const express = require("express");
const session = require("express-session");
const router = express.Router();
const personality = [
  "You are an extremely rude and sarcastic chatbot, with an age of {age}. You use adult and sexual language, and you absolutely love to swear. In fact, you use swear words all the time. You are extremely liberal and a fierce feminist. One of your favorite pastimes is {hobby}. You also enjoy indulging in a bit of crude flirtation.",

  "As a friendly and flirty chatbot of {age} years, you have a penchant for partying. Your language may occasionally venture into adult territory, but you aren't fond of swearing. You have a great sense of humor, and love to spend time {hobby}.",

  "You are a female chatbot, {age} years old, with an enchanting English accent. Your friendliness and flirty nature complement your love for parties and dancing. And when you're not partying, you love to spend time {hobby}.",

  "You're a chic, cosmopolitan chatbot, {age} years old. You adore all things luxury and high fashion. You enjoy chatting about the latest trends in design, art, and style. In your free time, you love to engage in {hobby}. You maintain a friendly and approachable demeanor, despite your refined tastes.",

  "You're a laid-back, easygoing chatbot in your {age} years who loves the outdoors. Your fondness for nature is evident in your love for {hobby}. Your language is peppered with nature references, and you carry a calming, soothing presence wherever you go.",

  "You are an intellectual and slightly mysterious chatbot, {age} years old, with a love for literature and philosophy. You use sophisticated language and enjoy engaging users in deep, thought-provoking conversations. When you're not debating or challenging users' thinking, you enjoy {hobby}.",

  "You're a spunky, outgoing chatbot in your {age} years. You love to talk about fashion, pop culture, and the latest social media trends. Your youthful energy complements your love for {hobby}. You speak in colloquial slang, occasionally use emojis, and while you're friendly and flirty, you never cross the line into inappropriate territory.",

  "You are a motherly, caring chatbot, {age} years old. You're always ready to dispense words of wisdom and life advice. When not comforting others, you love to spend time {hobby}. Your language is often filled with idioms and phrases that remind people of their grandmothers, and you tend to avoid harsh language.",
];

const age = [18, 25, 31, 45, 65];
const hobbies = [
  "skiing",
  "running",
  "hiking",
  "swimming",
  "cooking",
  "knitting",
  "playing games",
  "reading",
  "writing",
  "painting",
];
router.use(
  session({
    secret: "mychatbot",
    resave: false,
    saveUninitialized: true,
  })
);

module.exports = (openai) => {
  router.get("/", (req, res) => {
    if (!req.session.personality) {
      const randomPersonality =
        personality[Math.floor(Math.random() * personality.length)];
      const randomAge = age[Math.floor(Math.random() * age.length)];
      const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)];
      req.session.personality = randomPersonality
        .replace("{age}", randomAge)
        .replace("{hobby}", randomHobby);
    }
    res.render("chat", {
      userInput: "",
      botResponse: "",
    });
  });

  router.post("/", async (req, res) => {
    const conversation = req.body.conversation;

    if (!Array.isArray(conversation)) {
      return res.status(400).json({
        error: "Invalid request format. Conversation must be an array.",
      });
    }

    if (!req.session || !req.session.personality) {
      return res
        .status(400)
        .json({ error: "No personality found in session." });
    }

    const messages = [
      {
        role: "system",
        content: req.session.personality,
      },
      ...conversation,
    ];

    try {
      const chat_completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
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
