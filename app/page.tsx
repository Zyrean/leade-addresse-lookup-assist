"use client";

import { getCompanyPlaceId } from "@/lib/getCompanyPlaceId";
import { getPlaceInfos } from "@/lib/getCompanyInfos";
import { useEffect, useState } from "react";

export default function Home() {
  const [companyInput, setCompanyInput] = useState<string>("");
  const [countryInput, setCountryInput] = useState<string>("CH");
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [placeInfo, setPlaceInfo] = useState<any>(null);

  // Fetch place ID
  const handleGetPlaceId = async () => {
    const result = await getCompanyPlaceId(companyInput, countryInput);

    console.log("RESULT", result);

    if (result) {
      setPlaceId(result.placeId || "No place ID found");
    }
  };

  const handleGetPlaceInfo = async () => {
    if (!placeId || placeId === "No place ID found") {
      console.warn("No valid Place ID available");
      return;
    }

    const result = await getPlaceInfos(placeId);
    setPlaceInfo(result);
    console.log("PLACE INFO:", result);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="mx-auto w-fit flex flex-col gap-2">
        <label htmlFor="company">Company Name</label>
        <input
          type="text"
          name="company"
          value={companyInput}
          onChange={(e) => setCompanyInput(e.target.value)}
        />

        <button
          className="bg-blue-300 py-2 px-6 rounded-md"
          onClick={handleGetPlaceId}
        >
          Get place Id
        </button>

        {placeId && <p>PlaceId: {placeId}</p>}

        <button
          className="bg-red-300 py-2 px-6 rounded-md"
          onClick={handleGetPlaceInfo}
        >
          Get place Infos
        </button>

        {placeInfo && <p>TEST</p>}
      </div>
    </div>
  );
}
