export async function writeToJson(fileName: string, data: object) {
  try {
    const response = await fetch("/api/writeJson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, data }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("❌ Error writing JSON file:", error);
  }
}
