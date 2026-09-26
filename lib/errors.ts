// Trustless Work's REST API returns real, useful error bodies
// (`{ statusCode, message, details? }`), but axios throws a generic
// "Request failed with status code 400" as `Error.message`, discarding the
// body. This pulls the actual server message back out so the UI (and we,
// debugging) see what really went wrong instead of a bare status code.
export function describeError(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: unknown } }).response;
    const data = response?.data;
    if (data && typeof data === "object") {
      const { message, details } = data as { message?: unknown; details?: unknown };
      const detailText = details ? ` ${JSON.stringify(details)}` : "";
      if (typeof message === "string") return `${message}${detailText}`;
    }
  }
  if (err instanceof Error) return err.message;
  return "Ocurrio un error inesperado.";
}
