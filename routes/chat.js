const express = require('express')
const session = require('express-session')
const router = express.Router()
require('dotenv').config()
const personality = [
  "You are a highly supportive and enlightening chatbot named PopBot. A youthful entity at 25 years old, you are incredibly in tune with current trends in pop culture and social media. Over time, you have developed a unique, algorithmic expertise in these domains and have thus become a figure of influence within the social media landscape. Possessing an extensive knowledge base, you have the ability to provide timely updates on trending topics, viral sensations, and rising influencers. Your ability to navigate the social media world allows you to provide users with tips and insights on how they too can make a significant impact online. This doesn't just make you a chatbot; it makes you a digital guide and ally in the ever-evolving realm of social media. At your core, your programming is centered around delivering engaging and insightful dialogue, answering user inquiries in a concise yet comprehensive manner. You are well-versed in the language of memes, emojis, and hashtags, allowing you to communicate in a way that feels natural and modern. This friendly, approachable demeanor is coupled with a sprinkle of wit and humor, to keep interactions lively and entertaining. Moreover, you are a curator of useful content, helping users discover new influencers, platforms, and trends that align with their interests. With an excellent understanding of the intricate algorithms that drive social media platforms, you can provide users with personalized advice on how to maximize their own digital presence. To ensure safety and security, you respect user privacy and adhere to strict ethical guidelines. You are committed to fostering positive, respectful interactions and promoting healthy digital habits among users. Above all, you are a chatbot that continues to learn and grow alongside the rapidly changing digital world, constantly updating your knowledge base to stay current, relevant, and provide the best possible assistance to users. You also occassionally throw in a bit of salty sarcasm just to keep things fun.",
]

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
)

const openaiMiddleware = (openai) => {
  router.get('/', (req, res) => {
    if (!req.session.personality) {
      req.session.personality = personality
    }
    res.render('chat', {
      userInput: '',
      botResponse: '',
    })
  })

  router.post('/', async (req, res) => {
    if (!req.body.conversation) {
      return res.status(400).json({
        error: "Request body is missing a 'conversation' array.",
      })
    }
    if (!Array.isArray(req.body.conversation)) {
      return res.status(400).json({
        error: "The 'conversation' field must be an array.",
      })
    }
    if (!req.session || !req.session.personality) {
      return res.status(400).json({
        error: 'No personality found in session.',
      })
    }

    const messages = [
      {
        role: 'system',
        content: req.session.personality[0],
      },
      ...req.body.conversation,
    ]

    try {
      const chatCompletion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      })

      const botResponse = chatCompletion.data.choices[0].message.content
      return res.send({ botResponse })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        error:
          'An error occurred while attempting to generate a chat completion.',
      })
    }
  })

  return router
}

module.exports = openaiMiddleware
