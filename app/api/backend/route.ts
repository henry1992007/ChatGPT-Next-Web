import { NextRequest, NextResponse } from "next/server";
import { proxy } from "../proxyBackend";

async function makeRequest(req: NextRequest) {
  try {
    const proxyResult = await proxy({
      path: req.headers.get("path") || "",
      cookie: req.headers.get("Cookie") || "",
      fp: req.headers.get("fp") || "",
      action: new URL(req.url).pathname,
      method: req.method,
      body: req.body,
    });

    const res = new NextResponse(proxyResult.body);
    res.headers.set("Content-Type", "application/json");
    res.headers.set("Cache-Control", "no-cache");
    return res;
  } catch (e) {
    console.error("[JavaServer] ", req.body, e);
    return NextResponse.json(
      {
        error: true,
        msg: JSON.stringify(e),
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: NextRequest) {
  return makeRequest(req);
}

export async function GET(req: NextRequest) {
  return makeRequest(req);
}
//
// export const config = {
//   runtime: "edge",
// };
