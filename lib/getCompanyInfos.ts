interface PlaceInfos {
  placeId?: string | null;
  businessStatus?: string;
  phoneNumber?: string;
  companyName: string;
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

    const getComponent = (type: string) =>
      data.address_components?.find((comp: any) => comp.types.includes(type))
        ?.long_name || "";

    const streetNumber = getComponent("street_number");
    const streetName = getComponent("route");
    const city =
      getComponent("locality") || getComponent("administrative_area_level_2");
    const kanton = getComponent("administrative_area_level_1");
    const country = getComponent("country");
    const postCode = getComponent("postal_code");

    const {
      business_status: businessStatus,
      formatted_phone_number: phoneNumber,
      companyName,
      rating = 0,
      user_ratings_total: totalRating = 0,
      website = "",
    } = data;

    return {
      placeId,
      businessStatus,
      phoneNumber,
      companyName,
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
