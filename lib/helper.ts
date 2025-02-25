import isReachable from "is-reachable";

function getDomainFromEmail(email: string | null): string | undefined {
  if (!email) return undefined;

  const match = email.match(/@([\w.-]+)/);
  return match ? match[1] : undefined;
}

function getDomainFromURL(url: string): string {
  try {
    // Stelle sicher, dass die URL mit einem Protokoll beginnt, falls nicht, füge http:// hinzu
    if (!/^https?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    // Erstelle ein URL-Objekt
    const parsedUrl = new URL(url);
    // Entferne ‘www.’ falls vorhanden
    return parsedUrl.hostname.replace(/^www\./, "");
  } catch (error) {
    console.error("Ungültige URL:", url);
    return "";
  }
}

export async function isReachableRedirect(input: string): Promise<boolean> {
  if (input.startsWith("http://")) {
    const httpsUrl = input.replace("http://", "https://");
    console.log(`🔄 Trying HTTPS version: ${httpsUrl}`);

    try {
      const httpsReachable = await isReachable(httpsUrl);
      console.log("httpsReachable", httpsReachable);
      if (httpsReachable) {
        console.log(`✅ HTTPS version is reachable: ${httpsUrl}`);
        return true;
      } else {
        console.warn(`❌ HTTPS version is NOT reachable: ${httpsUrl}`);
        return false;
      }
    } catch (error) {
      console.error(`🚨 Error checking HTTPS version (${httpsUrl}):`, error);
      return false;
    }
  }

  // If the input is not HTTP, don't do anything
  return false;
}

export async function checkIfUrlExists(
  memberUrl: string | null,
  googleUrl: string | null
): Promise<boolean> {
  try {
    let googleReachable = false;
    let memberReachable = false;

    // 🔹 Normalize `memberUrl` if it lacks "http://" or "https://"
    if (memberUrl && !memberUrl.startsWith("http")) {
      memberUrl = "https://" + memberUrl;
    }

    // 🔹 Normalize `googleUrl` if it lacks "http://" or "https://"
    if (googleUrl && !googleUrl.startsWith("http")) {
      googleUrl = "https://" + googleUrl;
    }

    if (googleUrl) {
      try {
        googleReachable = await isReachable(googleUrl);

        if (googleReachable === false) {
          googleReachable = await isReachableRedirect(googleUrl);
        }
      } catch (error) {
        console.warn(`⚠️ Error checking googleUrl (${googleUrl}):`, error);
      }
    }

    if (memberUrl) {
      try {
        memberReachable = await isReachable(memberUrl);

        if (memberReachable === false) {
          memberReachable = await isReachableRedirect(memberUrl);
        }
      } catch (error) {
        console.warn(`⚠️ Error checking memberUrl (${memberUrl}):`, error);
      }
    }

    console.log("https://www.treuhand-immobilien-abt.ch/" === memberUrl);

    console.log("🔍 googleUrl:", googleUrl, "➡️ Reachable:", googleReachable);
    console.log("🔍 memberUrl:", memberUrl, "➡️ Reachable:", memberReachable);

    return googleReachable || memberReachable; // ✅ At least one must be valid
  } catch (error) {
    console.error("🚨 Unexpected error in reachability check:", error);
    return false;
  }
}

export function areDomainsEqual(
  memberEmail: string | null | undefined,
  memberWebsite: string | null | undefined,
  website: string | null | undefined
): boolean {
  const memberEmailDomain = memberEmail
    ? getDomainFromEmail(memberEmail)
    : undefined;
  const memberWebsiteDomain = memberWebsite
    ? getDomainFromURL(memberWebsite)
    : undefined;
  const websiteDomain = website ? getDomainFromURL(website) : undefined;

  return (
    memberEmailDomain?.trim() === websiteDomain?.trim() ||
    memberWebsiteDomain?.trim() === websiteDomain?.trim()
  );
}

export function splitStreetAndNumber(address) {
  if (!address) return { streetName: null, streetNumber: null };

  const regex = /(.*\D)(\d+)$/; // Matches the street name and street number at the end
  const match = address.trim().match(regex);

  if (match) {
    const streetName = match[1].trim(); // Everything before the number
    const streetNumber = match[2].trim(); // The last number
    return { streetName, streetNumber };
  } else {
    // In case no match is found (edge case if no number is at the end)
    return { streetName: address, streetNumber: null };
  }
}

export function splitCityAndZip(address) {
  if (!address) return { zip: null, city: null };

  const regex = /^(\d+)\s+(.*)$/; // Matches the zip code (number at the front) and city (everything else after)
  const match = address.trim().match(regex);

  if (match) {
    const zip = match[1].trim(); // The zip code (number at the start)
    const city = match[2].trim(); // The city (everything after the zip code)
    return { zip, city };
  } else {
    // If no match is found (edge case for invalid format)
    return { zip: null, city: address };
  }
}
