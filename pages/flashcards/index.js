import { useState, useEffect } from 'react';
import { db } from '../../Firebase/firebase';
import { collection, query, getDocs, deleteDoc, where, writeBatch } from 'firebase/firestore';
import Link from 'next/link';

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
          const setId = data.setId || "Unnamed Set";

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

  const handleDeleteSet = async (setId) => {
    try {
      const batch = writeBatch(db); // Use batch to delete multiple documents

      const flashcardsCollection = collection(db, "flashcards");
      const q = query(flashcardsCollection, where("setId", "==", setId));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // Update the state to remove the deleted set from the UI
      const updatedGroupedFlashcards = { ...groupedFlashcards };
      delete updatedGroupedFlashcards[setId];
      setGroupedFlashcards(updatedGroupedFlashcards);

      console.log(`Set ${setId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting set: ", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Flashcards</h1>
      <Link href="/flashcards/generate" passHref className="text-blue-600 mb-4 block">
        Generate New Flashcards
      </Link>
      {Object.keys(groupedFlashcards).map((setId) => (
        <div key={setId} className="mb-8">
          <div className="flex justify-between items-center">
            <Link href={`/flashcards/${setId}`} passHref className="text-xl font-semibold mb-2">
              {setId}
            </Link>
            <button
              onClick={() => handleDeleteSet(setId)}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete Set
            </button>
          </div>
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
