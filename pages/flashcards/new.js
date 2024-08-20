import { useState } from 'react';
import { db } from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';

export default function NewFlashcard() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, 'flashcards'), {
      question,
      answer,
    });

    setQuestion('');
    setAnswer('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Flashcard</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
