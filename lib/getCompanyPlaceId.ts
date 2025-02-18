interface CompanyPlaceId {
  placeId?: string;
  companyName?: string;

  country?: string;
}

export async function getCompanyPlaceId(
  companyName: string,
  country: string,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
): Promise<CompanyPlaceId | null> {
  const errors: Record<string, string> = {};

  if (!companyName.trim()) errors.companyName = "Invalid company name input";

  if (!country.trim()) errors.country = "Invalid country input";

  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return null;
  }

  try {
    const encodedCompanyName = encodeURIComponent(companyName);
    const encodedCountry = encodeURIComponent(country);

    const response = await fetch(
      `/api/placeId?companyName=${encodedCompanyName}&country=${encodedCountry}`
    );

    if (!response.ok) {
      setErrors({
        global: `Error fetching place ID from Company: ${companyName}`,
      });
      return null;
    }

    const data = await response.json();

    if (data.results[0].place_id === "ChIJYW1Zb-9kjEcRFXvLDxG1Vlw") {
      setErrors({
        companyName: `Invalid Company name`,
      });

      return null;
    }

    return data;
  } catch (error) {
    setErrors({
      global: `Error fetching information: ${(error as Error).message}`,
    });
    return null;
  }
}
