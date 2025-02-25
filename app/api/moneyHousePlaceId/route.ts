import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const companyName = searchParams.get("companyName");

  if (!companyName) {
    console.error("Missing companyName parameter in the request query");
    return NextResponse.json(
      { error: "Missing companyName parameter in query" },
      { status: 400 }
    );
  }

  const encodedCompanyName = encodeURIComponent(companyName);
  const url = `https://www.moneyhouse.ch/de/jx/instasearch?term=${encodedCompanyName}`;

  try {
    console.log(`Fetching data from: ${url}`); // Log the URL being requested
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `Failed to fetch from MoneyHouse API. Status: ${response.status}`
      );
      return NextResponse.json(
        { error: "Error getting MoneyHousePlaceId", status: response.status },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching from MoneyHouse API:", error);
    return NextResponse.json(
      { error: "Server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
