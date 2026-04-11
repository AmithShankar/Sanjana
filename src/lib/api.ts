const API_BASE =
  "https://the-sphinx-server.tail4034e9.ts.net/webhook/SarenaChat";

export async function sendMessage(message: string): Promise<string> {
  const url = `${API_BASE}/chatInput=${encodeURIComponent(`"${message}"`)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const raw = await response.text();

  try {
    const json = JSON.parse(raw);
    if (Array.isArray(json)) {
      const item = json[0];
      return (
        item?.output ||
        item?.text ||
        item?.message ||
        item?.response ||
        item?.content ||
        JSON.stringify(item)
      );
    }
    return (
      json.output ||
      json.text ||
      json.message ||
      json.response ||
      json.content ||
      raw
    );
  } catch {
    return raw;
  }
}
