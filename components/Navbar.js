import { UserButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="text-xl font-bold">Flashcard App</h1>
      <div>
        <UserButton />
      </div>
    </nav>
  );
}
