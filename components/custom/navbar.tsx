import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="w-full bg-[#35718E] fixed top-0 left-0 right-0">
      <nav className="flex justify-between items-center max-w-7xl mx-auto p-4">
        <Link href="/" className="flex items-center gap-3 flex-1">
          <Image src="/logo.png" alt="logo" width={60} height={60} />
          <span className="text-2xl font-bold text-white tracking-wider">
            AOEK
          </span>
        </Link>
        <ul className="flex items-center flex-[1.5] justify-around text-white text-base font-medium">
          <li>
            <Link href={"/"}>Home</Link>
          </li>
          <li>
            <Link href={"/committee"}>Committee</Link>
          </li>
          <li>
            <Link href={"/news"}>News</Link>
          </li>
          <li>
            <Link href={"/events"}>Events</Link>
          </li>
          <li>
            <Link href={"/gallery"}>Gallery</Link>
          </li>
          <li>
            <Link href={"/news-letter"}>Newsletter</Link>
          </li>
          <li>
            <Link href={"/updates"}>Updates</Link>
          </li>
          <li>
            <Button
              asChild
              className="py-2 px-12 font-semibold shadow-md"
              variant={"destructive"}
            >
              <Link href={"/login"}>Login</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
