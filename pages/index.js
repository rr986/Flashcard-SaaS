import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {/* Navigation Links */}
      <nav className="flex space-x-4 mb-8">
        <Link href="/flashcards">
          <a className="text-lg text-blue-600 hover:text-blue-800">Flashcard Sets</a>
        </Link>
        <Link href="/flashcards/new">
          <a className="text-lg text-blue-600 hover:text-blue-800">Create Flashcards</a>
        </Link>
        <Link href="/pricing">
          <a className="text-lg text-blue-600 hover:text-blue-800">Pricing</a>
        </Link>
      </nav>

      {/* Main Content */}
      <h1 className="text-4xl font-bold mb-6">Welcome to Flashcard App</h1>
      <Link href="/flashcards">
        <a className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">View Flashcards</a>
      </Link>
    </div>
  );
}
