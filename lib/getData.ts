import data from "@/data/test.json";
import { getCompanyPlaceId } from "./getCompanyPlaceId";
import { getPlaceInfos } from "./getCompanyInfos";

export default async function getData() {
  // console.log("Company Data:", data);

  for (const company of data) {
    const companyName = company["member-title"];

    // ✅ Fetch Place ID
    const result = await getCompanyPlaceId(companyName, "CH", () => {});

    if (result && result.results[0].place_id) {
      const placeId = result.results[0].place_id;

      // console.log("Found Place ID:", placeId);

      // ✅ Call getPlaceInfos() since we have a valid placeId
      const placeInfo = await getPlaceInfos(placeId);

      if (placeInfo) {
        console.log("✅ Place Info Retrieved:", placeInfo);
      } else {
        console.log("❌ Failed to Fetch Place Info");
      }
    } else {
      console.log("❌ NO COMPANY FOUND");
    }
  }
}
