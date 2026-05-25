export function errorHandler(error, _request, response, _next) {
  console.error(error);
  if (error.type === "entity.parse.failed") {
    return response.status(400).json({
      message: "Malformed JSON request body. Send a valid JSON object with Content-Type: application/json.",
      code: "MALFORMED_JSON",
    });
  }
  response.status(error.status || 500).json({ message: error.message || "Server error" });
}
