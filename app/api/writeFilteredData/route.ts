import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import data from "@/data/cleaned_svit_data.json";

export async function POST() {
  const validRegions = [
    "SVIT Zürich",
    "SVIT Bern",
    "SVIT Ostschweiz",
    "SVIT Zentralschweiz",
    "SVIT beider Basel",
    "SVIT Aargau",
    "SVIT Solothurn",
  ];

  //FILTER DATA ONLY FOR WANTED REGIONS
  const filteredData = data.filter((item) =>
    validRegions.includes(item["svit-region"])
  );

  const filePath = path.join(process.cwd(), "data", "filteredData.json");

  try {
    //WRITE DATA INTO "FILTEREDATA" FILE
    fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2), "utf-8");

    return NextResponse.json({
      message: "Filtered data written successfully",
      filePath: "/filteredData.json",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error writing file", error },
      { status: 500 }
    );
  }
}
