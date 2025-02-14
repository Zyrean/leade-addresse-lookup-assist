export default async function getFilteredData() {
  try {
    const response = await fetch("/api/writeFilteredData", {
      method: "POST",
    });

    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Failed to save filtered data:", error);
  }
}
