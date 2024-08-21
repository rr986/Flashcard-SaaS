import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navTitle">Flashcard App</h1>
      <Link href="/flashcards" className="navLink">
        Flashcard Sets
      </Link>
      <Link href="/flashcards/new" className="navLink">
        Create Flashcards
      </Link>
      <Link href="/pricing" className="navLink">
        Pricing
      </Link>
      <div className="navLink">
        <UserButton />
      </div>
    </nav>
  );
}
