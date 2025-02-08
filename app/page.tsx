"use client";

import { getCompanyPlaceId } from "@/lib/getCompanyPlaceId";
import { getPlaceInfos } from "@/lib/getCompanyInfos";
import { useState } from "react";

export default function Home() {
  const [companyInput, setCompanyInput] = useState<string>("");
  const [countryInput, setCountryInput] = useState<string>("CH");
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [placeInfo, setPlaceInfo] = useState<any>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch place ID
  const handleGetPlaceId = async () => {
    setErrors({});
    const result = await getCompanyPlaceId(
      companyInput,
      countryInput,
      setErrors
    );

    const id = result?.results[0].place_id;

    if (result) setPlaceId(id || "No place ID found");
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

        {/* Display error for companyName */}
        {errors.companyName && (
          <div style={{ color: "red" }}>
            <p>{errors.companyName}</p>
          </div>
        )}

        <label htmlFor="country">Country</label>
        <input
          type="text"
          name="country"
          value={countryInput}
          onChange={(e) => setCountryInput(e.target.value)}
        />

        {/* Display error for country */}
        {errors.country && (
          <div style={{ color: "red" }}>
            <p>{errors.country}</p>
          </div>
        )}

        {/* Display global error if any */}
        {errors.global && (
          <div style={{ color: "red" }}>
            <p>{errors.global}</p>
          </div>
        )}

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
