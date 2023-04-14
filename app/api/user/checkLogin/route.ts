import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

export async function POST(req: NextRequest) {
  const reqData = await req.text();
  let response = await fetch("http://127.0.0.1:7817/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: reqData,
  });

  if (response.ok) {
    let resp = await response.json();
    return NextResponse.json(resp, {
      status: 200,
    });
  }
}
