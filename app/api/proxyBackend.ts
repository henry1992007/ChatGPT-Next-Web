export async function proxy({
  path = "",
  cookie = "",
  fp = "",
  action = "",
  method,
  body,
}: {
  path: string;
  cookie?: string;
  fp: string;
  action?: string;
  method: string;
  body?: ReadableStream<Uint8Array> | null;
}) {
  path = path?.startsWith("/") ? path : "/" + path;
  path += path.indexOf("?") > -1 ? "&t=" + Date.now() : "?t=" + Date.now();

  let bodyStr = await readStream(body);

  // return fetch(`http://54.241.90.46:7817${path}`, {
  return fetch(`http://127.0.0.1:7817${path}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
      fp: fp,
      action: action,
    },
    method: method,
    body: bodyStr,
  });
}

async function readStream(
  stream: ReadableStream<Uint8Array> | null | undefined,
) {
  if (stream == null || typeof stream === "undefined") {
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
