"use client";

import { getCompanyPlaceId } from "@/lib/getCompanyPlaceId";

export default function Home() {
  return (
    <div>
      <button
        onClick={() =>
          getCompanyPlaceId("Lutz Gärten & Schwimmbäder GmbH", "CH")
        }
      >
        TEST
      </button>
    </div>
  );
}
