import { useState, useEffect } from 'react';
import db from '../../Firebase/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import Link from 'next/link';  // Import Link from Next.js

export default function Flashcards() {
  const [groupedFlashcards, setGroupedFlashcards] = useState({});

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const flashcardsCollection = collection(db, "flashcards");
        const q = query(flashcardsCollection);
        const querySnapshot = await getDocs(q);
        const cards = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const setId = data.setId || "Unnamed Set"; // Default to "Unnamed Set" if no setId

          if (!cards[setId]) {
            cards[setId] = [];
          }

          cards[setId].push({ id: doc.id, ...data });
        });

        setGroupedFlashcards(cards);
      } catch (error) {
        console.error("Error fetching flashcards: ", error);
      }
    };

    fetchFlashcards();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Flashcards</h1>
      {Object.keys(groupedFlashcards).map((setId) => (
        <div key={setId} className="mb-8">
          <Link href={`/flashcards/${setId}`} passHref>
            <a className="text-xl font-semibold mb-2">{setId}</a>
          </Link>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {groupedFlashcards[setId].map((card) => (
              <div key={card.id} className="p-4 border rounded">
                <h3 className="font-bold">{card.question}</h3>
                <p>{card.answer}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
