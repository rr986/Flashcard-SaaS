import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-6">Welcome to Flashcard App</h1>
      <Link href="/flashcards" className="px-4 py-2 bg-blue-600 text-white rounded">
        View Flashcards
      </Link>
    </div>
  );
}