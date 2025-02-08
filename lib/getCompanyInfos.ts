interface PlaceInfos {
  placeId?: string;
}

export async function getPlaceInfos(
  placeId: string
): Promise<PlaceInfos | null> {
  try {
    const response = await fetch(`/api/placeInfos?placeId=${placeId}`);

    if (!response.ok) {
      console.error("Error fetching place info:", response.status);
      return null;
    }

    const data = await response.json();

    console.log("DATA", data);
  } catch (error) {
    console.log("Error fetching infos", error);
  }
}
