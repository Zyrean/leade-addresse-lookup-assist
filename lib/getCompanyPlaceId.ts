interface CompanyPlaceId {
  placeId?: string;
  companyName?: string;
  country?: string;
}

export async function getCompanyPlaceId(
  companyName: string,
  country: string
): Promise<CompanyPlaceId | null> {
  try {
    const encodedCompanyName = encodeURIComponent(companyName);
    const encodedCountry = encodeURIComponent(country);

    const response = await fetch(
      `/api/placeId?companyName=${encodedCompanyName}&country=${encodedCountry}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.results[0].place_id === "ChIJYW1Zb-9kjEcRFXvLDxG1Vlw") {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function getMoneyHouseCompanyPlaceId(companyName: string) {
  try {
    const encodedCompanyName = encodeURIComponent(companyName);

    const response = await fetch(
      `/api/moneyHousePlaceId?companyName=${encodedCompanyName}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data;
  } catch {
    return null;
  }
}
