import { useState } from 'react';
import db from '../../Firebase/firebase';
import { addDoc, collection } from 'firebase/firestore';

export default function NewFlashcard() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [setId, setSetId] = useState(''); // Add an input to specify the set

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, 'flashcards'), {
      question,
      answer,
      setId, // Associate flashcard with a specific set
    });

    setQuestion('');
    setAnswer('');
    setSetId('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Flashcard</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Set ID</label>
          <input
            type="text"
            value={setId}
            onChange={(e) => setSetId(e.target.value)}
            className="mt-1 p-2 block w-full border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-1 p-2 block w-full border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mt-1 p-2 block w-full border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Flashcard
        </button>
      </form>
    </div>
  );
}
