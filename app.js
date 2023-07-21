require("dotenv").config();
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const port = process.env.PORT || 3000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Set up middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Import routes
const chatRoutes = require("./routes/chat")(openai);
app.use("/", chatRoutes);

// Start the server
app.listen(port, async () => {
  try {
    console.log(`Server listening on port ${port}`);
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
  }
});
