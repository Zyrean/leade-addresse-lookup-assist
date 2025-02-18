import data from "@/data/test.json"; // ✅ Ensure this import exists
import { getCompanyPlaceId } from "./getCompanyPlaceId";
import { getPlaceInfos } from "./getCompanyInfos";
import { writeToJson } from "./writeToJson";

export default async function getData() {
  try {
    const results = await Promise.all(
      data.map(async (company) => {
        const companyName = company["member-title"];

        try {
          const result = await getCompanyPlaceId(companyName, "CH", () => {});
          if (
            !result ||
            !result.results.length ||
            !result.results[0].place_id
          ) {
            console.warn(`No company found for: ${companyName}`);
            return null;
          }

          const placeId = result.results[0].place_id;
          const placeInfo = await getPlaceInfos(placeId);

          // Send each company data one by one
          await writeToJson(
            "testOutput",
            { ...company, ...placeInfo },
            () => {},
            () => {}
          );

          return { company, placeInfo };
        } catch (error) {
          console.error(`Error fetching data for ${companyName}:`, error);
          return null;
        }
      })
    );

    return results.filter(Boolean);
  } catch (error) {
    console.error("Unexpected error in getData:", error);
    return [];
  }
}
