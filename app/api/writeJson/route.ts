import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Handle POST request to append data to JSON file if not duplicate
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { fileName, data } = body;

    if (!fileName || !data || !data.placeId) {
      console.error("❌ Missing fileName or placeId:", { fileName, data });
      return NextResponse.json(
        { message: "Missing fileName or placeId" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), `${fileName}.json`);

    let existingData: any[] = [];

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      try {
        existingData = JSON.parse(fileContent);
        if (!Array.isArray(existingData)) existingData = []; // Ensure it's an array
      } catch (error) {
        console.error("❌ JSON Parsing Error:", error);
        existingData = []; // Reset if JSON is corrupted
      }
    }

    // Check if placeId already exists
    const exists = existingData.some((entry) => entry.placeId === data.placeId);

    if (exists) {
      console.warn("⚠️ Place ID already exists:", data.placeId);
      return NextResponse.json(
        { message: "Place ID already exists, not added" },
        { status: 409 }
      );
    }

    existingData.push(data);

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf8");

    return NextResponse.json(
      { message: "Data appended successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error writing JSON:", error);
    return NextResponse.json(
      { message: "Error writing JSON file" },
      { status: 500 }
    );
  }
}
