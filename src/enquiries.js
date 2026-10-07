export async function submitEnquiry(
  values,
  { provider = "local", fetchImpl = fetch } = {},
) {
  if (provider === "netlify") {
    const reference = `TM-${crypto.randomUUID()}`;
    const body = new URLSearchParams({
      "form-name": "trademor-enquiries",
      ...values,
      reference,
    });
    const response = await fetchImpl("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!response.ok) {
      throw new Error(
        "We couldn’t send your enquiry. Please try again shortly.",
      );
    }
    return { reference };
  }
  const response = await fetchImpl("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Please try again.");
  return result;
}
