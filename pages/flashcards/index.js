import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs } from 'firebase/firestore';

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const q = query(collection(db, "flashcards"));
      const querySnapshot = await getDocs(q);
      const cards = [];
      querySnapshot.forEach((doc) => {
        cards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(cards);
    };

    fetchFlashcards();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Flashcards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {flashcards.map((card) => (
          <div key={card.id} className="p-4 border rounded">
            <h2 className="font-bold">{card.question}</h2>
            <p>{card.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
