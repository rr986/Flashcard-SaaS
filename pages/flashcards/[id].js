import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import db from '../../Firebase/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';

export default function Flashcards() {
  const router = useRouter();
  const { id } = router.query;
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const flashcardsCollection = collection(db, "flashcards");
        const q = query(flashcardsCollection, where("setId", "==", id));
        const querySnapshot = await getDocs(q);
        const cards = [];
        querySnapshot.forEach((doc) => {
          cards.push({ id: doc.id, ...doc.data() });
        });
        setFlashcards(cards);
      } catch (error) {
        console.error("Error fetching flashcards: ", error);
      }
    };

    if (id) fetchFlashcards();
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Flashcards</h1>
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
