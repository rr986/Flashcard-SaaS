import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../Firebase/firebase';
import { collection, query, getDocs, where, doc, getDoc } from 'firebase/firestore';

export default function Flashcards() {
  const router = useRouter();
  const { id } = router.query;
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState('');

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const flashcardsCollection = collection(db, 'flashcards');
        const q = query(flashcardsCollection, where('setId', '==', id));
        const querySnapshot = await getDocs(q);
        const cards = [];
        querySnapshot.forEach((doc) => {
          cards.push({ id: doc.id, ...doc.data() });
        });
        setFlashcards(cards);
      } catch (error) {
        console.error('Error fetching flashcards: ', error);
      }
    };

    const fetchSetName = async () => {
      try {
        const docRef = doc(db, 'sets', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSetName(docSnap.data().name);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching set name: ', error);
      }
    };

    if (id) {
      fetchFlashcards();
      fetchSetName();
    }
  }, [id]);

  return (
    <div className="p-4">
      {setName && <h1 className="text-2xl font-bold mb-4">{setName}</h1>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {flashcards.map((card, index) => (
          <div
            key={card.id}
            className={`relative p-4 border rounded-lg shadow-lg bg-white ${
              index % 2 === 0 ? 'rotate-2' : '-rotate-2'
            }`}
            style={{
              transform: `translate(${index * 5}px, ${index * 5}px)`,
            }}
          >
            <h2 className="font-bold">{card.question}</h2>
            <p>{card.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
