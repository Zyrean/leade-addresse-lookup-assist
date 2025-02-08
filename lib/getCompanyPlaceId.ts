const key = process.env.NEXT_PUBLIC_API_KEY;

interface CompanyPlaceId {
  companyName?: string;
  country?: string;
  placeId?: string;
}

export async function getCompanyPlaceId(
  companyName: string,
  country: string
): Promise<CompanyPlaceId | null> {
  if (!key) {
    console.log("API KEY is missing");
    return null;
  }

  const encodedAddress = encodeURIComponent(companyName);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&components=country:${country}&key=${key}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log("data", data);

    if (data.status === "OK" && data.results.length > 0) {
      return {
        companyName,
        country,
        placeId: data.results[0].place_id,
      };
    } else {
      console.warn("No results found or API error:", data.status);
      return null;
    }
  } catch (error) {
    console.log("Error fetching data", error);
    return null;
  }
}
