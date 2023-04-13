import { createParser } from "eventsource-parser";
import { NextRequest, NextResponse } from "next/server";
import { requestOpenai } from "../../common";
import fetch, { RequestInfo } from "node-fetch";

const redis = require("redis");

async function createStream(req: NextRequest) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await requestOpenai(req);

  const contentType = res.headers.get("Content-Type") ?? "";
  if (!contentType.includes("stream")) {
    const content = await (
      await res.text()
    ).replace(/provided:.*. You/, "provided: ***. You");
    console.log("[Stream] error ", content);
    return "```json\n" + content + "```";
  }

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: any) {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk, { stream: true }));
      }
    },
  });
  return stream;
}

const client = await (async () => {
  const c = redis.createClient({
    url: "redis://127.0.0.1:6379",
    //password: 'your-redis-password', // 如果有密码，请取消注释并填写
  });
  await c.connect();
  return c;
})();

export async function POST(req: NextRequest) {
  var newVar = await client.get("hello");
  console.log(newVar);

  await fetch("http://127.0.0.1:7817/chat/checkSession", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId: "tedsfadsvsd" }),
  });

  // console.log("axiosResponse:" + JSON.stringify(response1))

  return NextResponse.json(
    {
      error: false,
      msg: { hello: "world" },
    },
    {
      status: 200,
    },
  );
}
