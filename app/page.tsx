"use client";

import getData from "@/lib/getData";
import getFilteredData from "@/lib/getFilteredData";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 flex-col gap-40">
      <div className="flex flex-col gap-4">
        <button
          className="bg-yellow-600 px-4 py-2 rounded-md"
          onClick={() => getFilteredData()}
        >
          Filter Data
        </button>
        <button
          className="bg-red-300 px-4 py-2 rounded-md"
          onClick={() => getData()}
        >
          Get final Data
        </button>
      </div>
    </div>
  );
}
