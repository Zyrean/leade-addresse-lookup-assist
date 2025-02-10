import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  console.log("SEARCHPARAM", searchParams);

  const placeId = searchParams.get("placeId");

  console.log("Extracted Place ID:", placeId);

  if (!placeId) {
    return NextResponse.json(
      { error: "Missing placeId parameter" },
      { status: 400 }
    );
  }

  const key = process.env.NEXT_PUBLIC_API_KEY;

  console.log("KEY", key);

  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=name,rating,formatted_phone_number,business_status,user_ratings_total,website,address_components&key=${key}`;

  console.log("Fetching data from Google API:", url);

  try {
    const response = await fetch(url);

    console.log("RESPONSE", response);

    const data = await response.json();

    console.log("Google API Response:", data);

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: "Error from Google API", status: data.status },
        { status: 500 }
      );
    }

    return NextResponse.json(data.result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
