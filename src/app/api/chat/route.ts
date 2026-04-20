import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = "https://the-sphinx-server.tail4034e9.ts.net/webhook/SarenaChat/chatInput";

  // Parse the incoming request body as JSON
  let chatInput: string = "";
  try {
    const body = await request.json();
    chatInput = body.chatInput;
    if (typeof chatInput !== "string") {
      return NextResponse.json({ error: "chatInput must be a string" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatInput,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: `Request failed with status ${response.status}` }, { status: response.status });
  }

  const raw = await response.text();

  try {
    const json = JSON.parse(raw);
    if (Array.isArray(json)) {
      const item = json[0];
      return NextResponse.json(
        item?.output ||
        item?.text ||
        item?.message ||
        item?.response ||
        item?.content ||
        item
      );
    }
    return NextResponse.json(
      json.output ||
      json.text ||
      json.message ||
      json.response ||
      json.content ||
      json
    );
  } catch {
    return NextResponse.json({ response: raw });
  }
}