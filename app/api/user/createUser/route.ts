import { createParser } from "eventsource-parser";
import { NextRequest, NextResponse } from "next/server";
import { requestOpenai } from "../../common";
import fetch, { RequestInfo } from "node-fetch";

const redis = require("redis");
// const mysql = require('mysql2');

const c = (async function () {
  const redisClient = redis.createClient({
    url: "redis://127.0.0.1:6379",
    //password: 'your-redis-password', // 如果有密码，请取消注释并填写
  });

  await redisClient.connect();
  return redisClient;
})();

export async function POST(req: NextRequest) {
  console.log(req.body);

  return "success";
}
