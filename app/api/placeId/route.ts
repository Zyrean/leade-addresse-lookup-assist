import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const companyName = searchParams.get("companyName");
  const country = searchParams.get("country");

  const key = process.env.NEXT_PUBLIC_API_KEY;

  const encodedCompanyName = encodeURIComponent(companyName);

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedCompanyName}&components=country:${country}&key=${key}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error getting GooglePlaceId", status: response.status },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: "Error getting PlaceId", status: data.status },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching from Google API:", error); // Log the error to capture details
    return NextResponse.json(
      { error: "Server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
