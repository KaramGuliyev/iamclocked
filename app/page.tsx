"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>ImClocked</h1>
      <Link href={"http://localhost:3000/api/auth/signin"}>Sign In</Link>
    </main>
  );
}
