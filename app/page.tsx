"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
<<<<<<< Updated upstream
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>ImClocked</h1>
=======
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleButtonClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js</h1>
      <Image src="/logo.svg" alt="Next.js Logo" width={200} height={200} />

      <button
        onClick={handleButtonClick}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Loading..." : "Send Request"}
      </button>

      {error && (
        <div className="mt-4 text-red-500">
          <p>Error: {error}</p>
        </div>
      )}
>>>>>>> Stashed changes
    </main>
  );
}
