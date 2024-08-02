import Image from "next/image";

export default function Home() {
  {
    console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.SECRET);
  }
  return <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>;
}
