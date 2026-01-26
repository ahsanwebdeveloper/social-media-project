import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-green-500 text-white p-6 flex justify-between items-center">
      <h1 className="font-bold text-xl">My Next App</h1>
      <div className="space-x-4 font-light">
        <Link href="/home">Home</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/user/ahsan">user</Link>
      </div>
    </nav>
  );
};

export default Navbar;
