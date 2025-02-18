export async function writeToJson(
  fileName: string,
  data: object,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  setSuccessMsg: React.Dispatch<React.SetStateAction<Record<string, string>>>
) {
  try {
    const response = await fetch("/api/writeJson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, data }),
    });

    const responseData = await response.json();

    if (response.ok) {
      setSuccessMsg({
        Json: "Company Successfully added!",
      });
    } else {
      setErrors({
        Json: `Error: ${responseData.message}`,
      });
    }
  } catch (error) {
    console.error("❌ Error writing JSON file:", error);
    setErrors({
      Json: "An error occurred while writing the file.",
    });
  }
}
