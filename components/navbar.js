"use client";

import Link from "next/link";
import { GalleryHorizontalEnd, User } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <div className="z-50 flex flex-wrap items-center justify-between border-b bg-white p-4">
      <div className="basis-1/3">
        <Link href="/gallery">
          <Button variant="outline">
            <GalleryHorizontalEnd />
          </Button>
        </Link>
      </div>
      <Link href="/">
        <span className="basis-1/3 cursor-pointer text-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          piicasso
        </span>
      </Link>
      <div className="flex basis-1/3 items-center justify-end gap-2 md:order-2">
        {/* <Link href="/auth/sign-in">
          <Button variant="outline" className="rounded-full">
            <User />
          </Button>
        </Link> */}
      </div>
    </div>
  );
};
