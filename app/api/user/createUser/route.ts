import { createParser } from "eventsource-parser";
import { NextRequest, NextResponse } from "next/server";
import { requestOpenai } from "../../common";
import fetch, { RequestInfo } from "node-fetch";

export async function POST(req: NextRequest) {
  console.log(req.body);

  return "success";
}
