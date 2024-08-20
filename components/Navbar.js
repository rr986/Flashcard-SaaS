import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="text-xl font-bold">Flashcard App</h1>
      <div className="flex space-x-4">
        <Link href="/flashcards">
          <a>Flashcard Sets</a>
        </Link>
        <Link href="/flashcards/new">
          <a>Create Flashcards</a>
        </Link>
        <Link href="/pricing">
          <a>Pricing</a>
        </Link>
        <UserButton />
      </div>
    </nav>
  );
}
