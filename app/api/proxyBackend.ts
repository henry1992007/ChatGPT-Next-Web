import { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const serverPath = req.headers.get("path");
  let path = serverPath?.startsWith("/") ? serverPath : "/" + serverPath;
  path += path.indexOf("?") > -1 ? "&t=" + Date.now() : "?t=" + Date.now();

  let bodyStr = await readStream(req.body);

  return fetch(`http://172.31.4.115:7817${path}`, {
    // return fetch(`http://127.0.0.1:7817${path}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers.get("Cookie") || "",
      fp: req.headers.get("fp") || "",
    },
    method: req.method,
    body: bodyStr,
  });
}

async function readStream(stream: ReadableStream<Uint8Array> | null) {
  if (stream == null) {
    return null;
  }

  const reader = stream.getReader();
  let result = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // 假设流的内容是文本数据
      result += new TextDecoder().decode(value);
    }
  } catch (error) {
    console.error("Error while reading the stream:", error);
  } finally {
    reader.releaseLock();
  }

  return result;
}
