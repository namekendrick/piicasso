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

// const SignIn = () => {
//   return (
//     <section className="flex min-h-full overflow-hidden pt-16 sm:py-28">
//       <div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
//         <div className="relative mt-12 sm:mt-16">
//           <h1 className="text-center text-2xl font-medium tracking-tight text-gray-900">
//             Sign in to continue.
//           </h1>
//         </div>
//         <div className="sm:rounded-5xl -mx-4 mt-4 flex-auto bg-white px-4 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-24">
//           <GoogleSignInButton />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SignIn;
