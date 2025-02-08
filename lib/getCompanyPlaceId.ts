interface CompanyPlaceId {
  companyName?: string;
  country?: string;
  placeId?: string;
}

export async function getCompanyPlaceId(
  companyName: string,
  country: string,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
): Promise<CompanyPlaceId | null> {
  const errors: Record<string, string> = {};

  if (!companyName.trim()) errors.companyName = "Invalid companyName input";

  if (!country.trim()) errors.country = "Invalid country input";

  if (Object.keys(errors).length > 0) {
    setErrors(errors); // Set errors in the state
    return null;
  }

  try {
    const encodedCompanyName = encodeURIComponent(companyName);
    const encodedCountry = encodeURIComponent(country);

    const response = await fetch(
      `/api/placeId?companyName=${encodedCompanyName}&country=${encodedCountry}`
    );

    if (!response.ok) {
      setErrors({ global: `Error fetching place ID: ${response.status}` });
      return null; // Handle failure by returning null
    }

    const data = await response.json();

    return data;
  } catch (error) {
    setErrors({
      global: `Error fetching information: ${(error as Error).message}`,
    });
    return null; // Return null on error
  }
}
