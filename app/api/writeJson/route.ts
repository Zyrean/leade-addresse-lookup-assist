import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileName, data } = body;

    const filePath = path.join(process.cwd(), `${fileName}.json`);

    let existingData: any[] = [];

    try {
      // Read the existing file content
      const fileContent = await fs.readFile(filePath, "utf8");

      // Check if the file content is non-empty and valid JSON
      if (fileContent.trim()) {
        existingData = JSON.parse(fileContent);

        if (!Array.isArray(existingData)) {
          existingData = []; // Ensure it's an array if it's not
        }
      }
    } catch (error) {
      // If the file doesn't exist or error reading/parsing, initialize with an empty array
      console.warn("⚠️ File not found or error reading file:", error);
      existingData = [];
    }

    // Loop through the data and add it to the existing array
    if (Array.isArray(data)) {
      existingData.push(...data); // Spread to add multiple objects if `data` is an array
    } else {
      existingData.push(data); // If `data` is a single object, add it directly
    }

    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), "utf8");

    return NextResponse.json(
      { message: "✅ Data added successfully!" },
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
