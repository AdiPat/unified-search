/**
 *
 * Constructs a URL with query parameter for Google Search
 * @param query Query string to search on Google
 * @returns Formatted URL
 *
 */
export const constructUrl = (baseUrl: string, query: string): string => {
  try {
    const url_ = new URL(baseUrl);
    const params = new URLSearchParams(url_.search);
    params.append("q", query);

    if (baseUrl.includes("https://duckduckgo.com/")) {
      params.append("t", "h_");
      params.append("ia", "web");
    }

    url_.search = params.toString();
    const url = url_.toString();
    return url;
  } catch (error) {
    console.error("constructUrl(): failed to construct URL", error);
    return null;
  }
};
