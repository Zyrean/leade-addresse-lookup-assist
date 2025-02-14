"use client";

import { getCompanyPlaceId } from "@/lib/getCompanyPlaceId";
import { getPlaceInfos } from "@/lib/getCompanyInfos";
import { useEffect, useState } from "react";
import { writeToJson } from "@/lib/writeToJson";
import getData from "@/lib/getData";

export default function Home() {
  const [companyInput, setCompanyInput] = useState<string>("");
  const [countryInput, setCountryInput] = useState<string>("CH");
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [placeInfo, setPlaceInfo] = useState<any>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<Record<string, string>>({});

  const handleGetPlaceId = async () => {
    setErrors({});
    const result = await getCompanyPlaceId(
      companyInput,
      countryInput,
      setErrors
    );

    const id = result?.results[0].place_id;

    if (result) setPlaceId(id);
  };

  const handleGetPlaceInfo = async () => {
    const result = await getPlaceInfos(placeId);
    setPlaceInfo(result);
  };

  const handleAddJson = async () => {
    writeToJson("test", placeInfo, setErrors, setSuccessMsg);

    setPlaceId("");
    setPlaceInfo("");
    setCompanyInput("");
  };

  useEffect(() => {
    if (successMsg.Json) {
      const timer = setTimeout(() => {
        setSuccessMsg({});
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer); // Cleanup on component unmount
    }
  }, [successMsg.Json]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="mx-auto w-fit flex flex-col gap-2 min-w-96 max-w-96">
        <label htmlFor="company">Company Name</label>
        <input
          className="px-2 py-2"
          type="text"
          name="company"
          value={companyInput}
          onChange={(e) => setCompanyInput(e.target.value)}
        />

        {errors.companyName && (
          <div className="text-red-600">
            <p>{errors.companyName}</p>
          </div>
        )}

        <label htmlFor="country">Country</label>
        <input
          className="px-2 py-2"
          type="text"
          name="country"
          value={countryInput}
          onChange={(e) => setCountryInput(e.target.value)}
        />

        {errors.country && (
          <div className="text-red-600">
            <p>{errors.country}</p>
          </div>
        )}

        {errors.global && (
          <div className="text-red-600">
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
          className="bg-red-300 py-2 px-6 rounded-md transition duration-500 disabled:bg-gray-200 disabled:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGetPlaceInfo}
          disabled={!placeId?.trim()}
        >
          Get Place Info
        </button>

        {placeInfo && (
          <div className="bg-violet-100 p-6 rounded-xl mt-4">
            <p>Name: {placeInfo.name}</p>
            <p>Website: {placeInfo.website}</p>
            <p>Status: {placeInfo.businessStatus}</p>
            <p>Rating: {placeInfo.rating}</p>
            <p>
              Total Rating:{" "}
              {placeInfo.totalRating ? ` ${placeInfo.totalRating}` : "-"}
            </p>
            <p>
              PhoneNumber:
              {placeInfo.phoneNumber ? ` ${placeInfo.phoneNumber}` : "-"}
            </p>

            <p>
              {placeInfo.streetName} {placeInfo.streetNumber}{" "}
            </p>
            <p>
              {placeInfo.postCode} {placeInfo.city}
            </p>
            <p>
              {placeInfo.kanton} {placeInfo.country}
            </p>
          </div>
        )}

        <button
          className="bg-red-300 py-2 px-6 rounded-md transition duration-500 disabled:bg-gray-200 disabled:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddJson}
          disabled={!placeId?.trim()}
        >
          Add to Json file
        </button>

        {errors.Json && (
          <div className="text-red-600">
            <p>{errors.Json}</p>
          </div>
        )}

        {successMsg && <p className="text-green-500 mt-2">{successMsg.Json}</p>}
      </div>

      <button onClick={() => getData()}>Test</button>
    </div>
  );
}
