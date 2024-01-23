import { Baloo_Bhai_2 } from "next/font/google";
import Link from "next/link";
import React from "react";

const inter = Baloo_Bhai_2({ subsets: ["latin"] });
export default function Setting() {
  return (
    <main
      className={`bg-slate-300 text-slate-800 min-h-screen pb-10 ${inter.className} p-4`}
    >
      <h2 className="text-2xl font-semibold">Settings</h2>
      <ol>
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li>
          <Link href={"/upload"}>Upload File</Link>
        </li>
        <li>
          <Link href={"/text"}>Text-To-TimeLogs</Link>
        </li>
      </ol>
    </main>
  );
}
