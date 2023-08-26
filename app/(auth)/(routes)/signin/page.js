import GoogleSignInButton from "@/components/GoogleSignInButton";
import Link from "next/link";

export default function SignIn() {
  return (
    <>
      <div className="fixed left-0 top-0 z-50 h-full max-h-full w-full overflow-y-auto bg-white">
        <div className="mx-auto my-28 max-w-md rounded-lg bg-white p-8 shadow-xl md:p-10">
          <div className="relative mx-auto mb-12 flex h-24 w-44">
            <Link href="/" className="w-full my-auto">
              <h1 className="text-center text-4xl">piicasso</h1>
            </Link>
          </div>
          <div className="mb-6 flex">
            <div className="flex-1 border-b"></div>
            <div className="flex-2 h-3 px-3 text-center">Continue with</div>
            <div className="flex-1 border-b"></div>
          </div>
          <GoogleSignInButton />
        </div>
      </div>
    </>
  );
}
