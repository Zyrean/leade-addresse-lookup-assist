import data from "@/data/test.json";
import { getCompanyPlaceId } from "./getCompanyPlaceId";
import { getPlaceInfos } from "./getCompanyInfos";
import { writeToJson } from "./writeToJson";

export default async function getData() {
  for (const company of data) {
    const companyName = company["member-title"];

    const result = await getCompanyPlaceId(companyName, "CH", () => {});

    if (result && result.results.length > 0 && result.results[0].place_id) {
      const placeId = result.results[0].place_id;

      const placeInfo = await getPlaceInfos(placeId);

      writeToJson(
        "data/testOutput",
        placeInfo ?? {},
        () => {},
        () => {}
      );
    } else {
      console.log("NO COMPANY FOUND");
    }
  }
}
