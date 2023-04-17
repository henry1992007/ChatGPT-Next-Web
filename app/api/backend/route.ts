import { NextRequest, NextResponse } from "next/server";
import { proxy } from "../proxyBackend";

async function makeRequest(req: NextRequest) {
  try {
    const proxyResult = await proxy(req);
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
