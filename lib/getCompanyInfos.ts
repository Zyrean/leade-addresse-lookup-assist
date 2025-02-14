export async function getPlaceInfos(
  placeId: string | null
): Promise<PlaceInfos | null> {
  if (!placeId) {
    console.error("Invalid placeId");
    return null;
  }

  try {
    const response = await fetch(`/api/placeInfos?placeId=${placeId}`);

    if (!response.ok) {
      console.error("Error fetching place info:", response.status);
      return null;
    }

    const data = await response.json();

    console.log("DATA", data);

    const streetNumber = data.address_components[0].long_name || "";
    const streetName = data.address_components[1].long_name || "";
    const city = data.address_components[2].long_name || "";
    const kanton = data.address_components[4].long_name || "";
    const country = data.address_components[5].long_name || "";
    const postCode = data.address_components[6].long_name || "";

    const {
      business_status: businessStatus,
      formatted_phone_number: phoneNumber,
      name,
      rating,
      user_ratings_total: totalRating,
      website,
    } = data;

    return {
      placeId,
      businessStatus,
      phoneNumber,
      name,
      rating,
      totalRating,
      website,
      streetNumber,
      streetName,
      city,
      kanton,
      country,
      postCode,
    };
  } catch (error) {
    console.error("Error fetching place info:", error);
    return null;
  }
}

interface PlaceInfos {
  placeId?: string | null;
  businessStatus?: string;
  phoneNumber?: string;
  name: string;
  rating: number;
  totalRating: number;
  website: string;
  streetNumber: string;
  streetName: string;
  city: string;
  kanton: string;
  country: string;
  postCode: string;
}
