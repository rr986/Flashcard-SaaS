const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');
const { collection, addDoc, getDocs } = require('firebase/firestore');
const { db } = require('../../firebase'); // Use named import

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

exports.generateFlashcards = functions.https.onRequest(async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).send({
      success: false,
      message: 'Topic is required to generate flashcards',
    });
  }

  try {
    // Use the imported db instance
    const flashcardsRef = collection(db, 'flashcards');

    const snapshot = await getDocs(flashcardsRef);
    const existingFlashcards = [];
    snapshot.forEach(doc => {
      existingFlashcards.push(doc.data());
    });

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Generate a set of flashcards on the topic: ${topic}` }
      ],
    });

    const flashcards = chatCompletion.choices[0].message.content.trim().split('\n');

    await addDoc(flashcardsRef, {
      topic,
      flashcards,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send({
      success: true,
      flashcards,
    });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).send({
      success: false,
      message: 'Failed to generate flashcards',
    });
  }
});

