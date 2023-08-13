import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Settings, LogOut } from "lucide-react";

export default function UserDropdown({ user }) {
  console.log(user);
  const ref = useRef();

  const [isNavOpen, setNavOpen] = useState(false);
  const toggleNavOpen = () => setNavOpen(!isNavOpen);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (isNavOpen && ref.current && !ref.current.contains(e.target)) {
        setNavOpen(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isNavOpen]);

  return (
    <div className="relative z-[1000]" ref={ref}>
      <button
        onClick={toggleNavOpen}
        className="block h-8 w-8 overflow-hidden rounded-full"
      >
        <div className="relative h-full w-full">
          <Image
            fill
            style={{ objectFit: "cover", borderRadius: "100%" }}
            src={user.image}
            alt={user.name}
          />
        </div>
      </button>
      {isNavOpen ? (
        <div className="absolute right-0 mt-3 w-52 rounded-md border bg-white py-2 shadow">
          <Link href={`/settings`}>
            <div className="flex cursor-pointer items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
              <div className="mr-2 w-8">
                <Settings />
              </div>
              <span>Settings</span>
            </div>
          </Link>
          <div
            className="flex cursor-pointer items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <div className="mr-2 w-8">
              <LogOut />
            </div>
            <span>Sign out</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
