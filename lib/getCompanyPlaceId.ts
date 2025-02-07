const key = process.env.NEXT_PUBLIC_API_KEY;

interface CompanyPlaceId {
  companyName?: string;
  country?: string;
}

export async function getCompanyPlaceId(
  companyName: string,
  country: string
): Promise<CompanyPlaceId> {
  const encodedAddress = encodeURIComponent(companyName);

  console.log("CompanyName:", companyName, "/", "Country:", country);
  console.log("encodedAddress", encodedAddress);

  console.log(key);

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&components=country:${country}&key=${key}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log("data", data);
  } catch (error) {
    console.log("Error fetching data", error);
  }

  return {
    companyName,
    country,
  };
}
