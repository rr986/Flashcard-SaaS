const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: 'sk-7vbAf-q5vp3eYTq-3sxsGqJYobOAacG-HUyhLvz1ywT3BlbkFJYQ1E3JHWm7GKLE7OhJ0rwQoonMJ-i1rdgECgRcv5MA', // Replace with your actual API key
});

async function generateChatCompletion() {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello!" }],
    });

    console.log(chatCompletion.choices[0].message);
  } catch (error) {
    console.error('Error generating chat completion:', error);
  }
}

generateChatCompletion();
