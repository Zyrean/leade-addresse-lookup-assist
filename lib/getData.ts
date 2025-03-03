import data from "@/data/test.json"; // ✅ Ensure this import exists
import {
  getCompanyPlaceId,
  getMoneyHouseCompanyPlaceId,
} from "./getCompanyPlaceId";
import { getPlaceInfos } from "./getCompanyInfos";
import { writeToJson } from "./writeToJson";
import { areDomainsEqual, splitStreetAndNumber } from "./helper";

export default async function getData() {
  try {
    const results = await Promise.all(
      data.map(async (company) => {
        try {
          const companyName = company["member-title"];

          const result = await getCompanyPlaceId(companyName, "CH");

          const moneyInfo = await getMoneyHouseCompanyPlaceId(companyName);

          if (
            !result ||
            !result.results.length ||
            !result.results[0].place_id
          ) {
            console.warn(`No company found for: ${companyName}`);

            console.log(moneyInfo);

            if (Object.keys(moneyInfo).length === 0) {
              await writeToJson("testOutput", {
                ...company,
                googlePlaceId: null,
                CompanyNameMoneyHouse: null,
                moneyHousePlaceId: null,
                active: null,
                moneyHouseUri:null,
                StreetName: null,
                streetNumber: null,
                postCode: null,
                city: null,
                businessStatus: null,
                phoneNumber: null,
                companyName: null,
                rating: null,
                totalRating: null,
                website: null,
                kanton: null,
                country: null,
                domainValid: false,
                hasGoogleEntry: false,
              });
            }

            if (Object.keys(moneyInfo).length === 1) {
              const {
                active,
                address: { city, street, zip },
                name: CompanyNameMoneyHouse,
                uri: moneyHouseUri,
              } = moneyInfo[0];

              const { streetName, streetNumber } = splitStreetAndNumber(street);

              await writeToJson("testOutput", {
                ...company,
                googlePlaceId: null,
                CompanyNameMoneyHouse,
                moneyHouseUri,
                active,
                streetName,
                streetNumber,
                postCode: zip,
                city,
                businessStatus: null,
                phoneNumber: null,
                companyName: null,
                rating: null,
                totalRating: null,
                website: null,
                kanton: null,
                country: null,
                domainValid: false,
                hasGoogleEntry: false,
              });
            }
            if (Object.keys(moneyInfo).length > 1) {
              const splitMemberZip = company["member-zip-city"]
                .split(" ")
                .shift();

              console.log("splitMemberZip", splitMemberZip);

              const foundItem = moneyInfo.find((item) => {
                return item.address.zip === splitMemberZip;
              });

              console.log(foundItem);

              const {
                active,
                address: { city, street, zip },
                name: CompanyNameMoneyHouse,
                uri: moneyHouseUri,
              } = foundItem;

              const { streetName, streetNumber } = splitStreetAndNumber(street);

              await writeToJson("testOutput", {
                ...company,
                googlePlaceId: null,
                CompanyNameMoneyHouse,
                moneyHouseUri,
                active,
                streetName,
                streetNumber,
                postCode: zip,
                city,
                businessStatus: null,
                phoneNumber: null,
                companyName: null,
                rating: null,
                totalRating: null,
                website: null,
                kanton: null,
                country: null,
                domainValid: false,
                hasGoogleEntry: false,
              });
            }
          } else {
            const googlePlaceId = result?.results[0].place_id;
            const placeInfo = await getPlaceInfos(googlePlaceId);

            if (!placeInfo) {
              console.warn(`⚠️ No place info found for: ${companyName}`);
              return null;
            }

            const valid = areDomainsEqual(
              company["member-email"],
              company["member-website"],
              placeInfo.website
            );

            if (Object.keys(moneyInfo).length === 0) {
              await writeToJson("testOutput", {
                ...company,
                ...placeInfo,
                googlePlaceId: null,
                CompanyNameMoneyHouse: null,
                moneyHousePlaceId: null,
                active: null,
                // street: null,
                postCode: null,
                city: null,
                businessStatus: null,
                phoneNumber: null,
                companyName: null,
                rating: null,
                totalRating: null,
                website: null,
                kanton: null,
                country: null,
                domainValid: valid,
                hasGoogleEntry: false,
              });
            } else {
              const {
                active,
                address: { city, street, zip },
                name: CompanyNameMoneyHouse,
                uri: moneyHousePlaceId,
              } = moneyInfo[0];

              await writeToJson("testOutput", {
                ...company,
                ...placeInfo,
                googlePlaceId,
                CompanyNameMoneyHouse,
                moneyHousePlaceId,
                active,
                street,
                postCode: zip,
                city,
                businessStatus: null,
                phoneNumber: null,
                companyName: null,
                rating: null,
                totalRating: null,
                website: null,
                kanton: null,
                country: null,
                domainValid: false,
                hasGoogleEntry: false,
              });
            }

            return { ...company, valid, hasGoogleEntry: true };
          }
        } catch (error) {
          console.error(`❌ Fehler für ${company["member-title"]}:`, error);
          return null;
        }
      })
    );

    console.log("Total companies processed:", results.filter(Boolean).length);
    return results.filter(Boolean);
  } catch (error) {
    console.error("Unexpected error in getData:", error);
    return [];
  }
}
