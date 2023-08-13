"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { GalleryHorizontalEnd } from "lucide-react";

import { Button } from "./ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserDropdown from "./UserDropdown";

const Navbar = () => {
  const { data: user, status } = useSession();

  return (
    <div className="bg-white border-b flex flex-wrap items-center justify-between p-4">
      <div className="basis-1/3">
        <Link href="/gallery">
          <Button className="border-none" variant="link">
            <GalleryHorizontalEnd />
          </Button>
        </Link>
      </div>
      <Link href="/">
        <span className="text-center basis-1/3 text-2xl cursor-pointer font-semibold whitespace-nowrap dark:text-white">
          piicasso
        </span>
      </Link>
      {
        <div className="flex justify-end basis-1/3 items-center md:order-2 gap-2">
          {status === "loading" && (
            <Skeleton className="h-8 w-8 rounded-full" />
          )}
          {user ? <UserDropdown user={user.user} /> : null}
        </div>
      }
    </div>
  );
};

export default Navbar;
