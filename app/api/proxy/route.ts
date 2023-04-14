import { NextRequest, NextResponse } from "next/server";
import { requestOpenai } from "../common";
import Cookies from "js-cookie";
import { Headers } from "node-fetch";

async function makeRequest(req: NextRequest) {
  try {
    const serverPath = req.headers.get("path");
    let path = serverPath.startsWith("/") ? serverPath : "/" + serverPath;
    path += path.indexOf("?") > -1 ? "&t=" + Date.now() : "?t=" + Date.now();
    const proxyResult = await fetch(`http://172.31.4.115:7817${path}`, {
      headers: req.headers,
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
