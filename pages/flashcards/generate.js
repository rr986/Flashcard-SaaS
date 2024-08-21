import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../Firebase/firebase';

export default function GenerateFlashcards() {
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setId, setSetId] = useState(''); // This will be generated based on the topic
  const [showAddButton, setShowAddButton] = useState(false); // State to control the visibility of the "Add to Set" button

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://us-central1-flashcard-saas-2b7e0.cloudfunctions.net/generateFlashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      if (data.success) {
        const generatedSetId = topic.replace(/\s+/g, '_'); // Use the topic as the set ID, replacing spaces with underscores
        setSetId(generatedSetId);
        const parsedFlashcards = [];

        // Parse the flashcards from the API response
        for (let i = 0; i < data.flashcards.length; i += 2) {
          const question = data.flashcards[i]?.replace('Front of card: ', '').trim();
          const answer = data.flashcards[i + 1]?.replace('Back of card: ', '').trim();
          if (question && answer) {
            parsedFlashcards.push({ question, answer });
          }
        }

        setFlashcards(parsedFlashcards);
        setShowAddButton(true); // Show the "Add to Set" button
      } else {
        console.error('Error generating flashcards:', data.message);
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
    }
    setLoading(false);
  };

  const handleAddToSet = async () => {
    try {
      for (const flashcard of flashcards) {
        await addDoc(collection(db, 'flashcards'), {
          question: flashcard.question,
          answer: flashcard.answer,
          setId,
        });
      }
      console.log('Flashcards added to the set successfully.');
      setShowAddButton(false); // Hide the button after adding
    } catch (error) {
      console.error('Error adding flashcards to set:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Flashcards</h1>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic"
        className="p-2 border rounded"
      />
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-blue-600 text-white rounded mt-2"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Flashcards'}
      </button>

      {flashcards.length > 0 && (
        <div className="mt-4">
          {flashcards.map((flashcard, index) => (
            <div key={index} className="p-4 border rounded mb-2">
              <h3 className="font-bold">{flashcard.question}</h3>
              <p>{flashcard.answer}</p>
            </div>
          ))}
        </div>
      )}

      {showAddButton && (
        <button
          onClick={handleAddToSet}
          className="px-4 py-2 bg-green-600 text-white rounded mt-4"
        >
          Add Flashcards to Set
        </button>
      )}
    </div>
  );
}
