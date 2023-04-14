import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

const redis = require("redis");

const mysql = require("mysql2");

const redisClient = redis.createClient({
  url: "redis://127.0.0.1:6379",
  //password: 'your-redis-password', // 如果有密码，请取消注释并填写
});
(async () => {
  await redisClient.connect();
})();

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
