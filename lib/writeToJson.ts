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

    if (response.ok)
      setSuccessMsg({
        Json: "Company Successfully added!",
      });
    else {
      setErrors({
        Json: `Company already exist on this file `,
      });
      return null;
    }
  } catch (error) {
    console.error("Error writing JSON file:", error);
  }
}
