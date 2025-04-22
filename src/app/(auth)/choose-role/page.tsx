"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lobster } from 'next/font/google'

const playfair = Lobster({
  subsets: ['latin'],
  weight: ['400'], // or '400', '600', etc.
})

export default function ChooseRolePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Section - Violet/Purple */}
      <div className="bg-violet-600 flex-1 flex flex-col items-center justify-end pb-12 text-white">
        <h1 className={`${playfair.className} text-8xl sm:text-5xl md:text-6xl font-serif font-extrabold text-yellow-400`}>
          Le Tour Du World
        </h1>
        <p className="text-center text-md sm:text-lg mt-4 max-w-xl px-4">
          Discover stories beyond borders, share your journey, or host the next adventure.
          <br />
          <span className="font-semibold">Join us.</span>
        </p>
      </div>

      {/* Bottom Section - Orange */}
      <div className="bg-orange-100 flex-1 flex flex-col items-center justify-start pt-10 rounded-t-3xl shadow-inner">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Role</h2>
        <div className="flex gap-4 w-[90%] max-w-md justify-center">
          <Button
            onClick={() => router.push("/login?type=tourist")}
            className="w-1/2 text-md font-semibold border border-gray-400 text-gray-900 hover:bg-gray-100 transition"
          >
            Tourist
          </Button>
          <Button
  onClick={() => router.push("/login?type=host")}
  
  className="w-1/2 text-md font-semibold border border-gray-400 text-gray-900 hover:bg-gray-100 transition"
>
  Host
</Button>

        </div>
      </div>
    </div>
  );
}
