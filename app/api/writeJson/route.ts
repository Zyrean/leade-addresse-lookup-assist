import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Handle POST request to append data to JSON file if not duplicate
export async function POST(req: Request) {
  try {
    const { fileName, data } = await req.json(); // Get file name & data

    if (!fileName || !data || !data.placeId) {
      return NextResponse.json(
        { message: "Missing fileName or placeId" },
        { status: 400 }
      );
    }

    // Define file path in the root directory
    const filePath = path.join(process.cwd(), `${fileName}.json`);

    let existingData: any[] = [];

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      try {
        existingData = JSON.parse(fileContent);
        if (!Array.isArray(existingData)) existingData = []; // Ensure it's an array
      } catch (error) {
        existingData = []; // Reset if JSON is corrupted
      }
    }

    // Check if placeId already exists
    const exists = existingData.some((entry) => entry.placeId === data.placeId);

    if (exists) {
      return NextResponse.json(
        { message: "Place ID already exists, not added" },
        { status: 409 }
      );
    }

    // Append new data
    existingData.push(data);

    // Convert back to JSON format
    const jsonData = JSON.stringify(existingData, null, 2);

    // Write updated data to file
    fs.writeFileSync(filePath, jsonData, "utf8");

    return NextResponse.json(
      { message: "Data appended successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error writing JSON:", error);
    return NextResponse.json(
      { message: "Error writing JSON file" },
      { status: 500 }
    );
  }
}
