import {NextRequest, NextResponse} from "next/server";
import {getServerSideConfig} from "./app/config/server";
import md5 from "spark-md5";
import {proxy} from "./app/api/proxyBackend";

export const config = {
  matcher: ["/api/openai", "/api/chat-stream"],
};

const serverConfig = getServerSideConfig();

function getIP(req: NextRequest) {
  let ip = req.ip ?? req.headers.get("x-real-ip");
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "";
  }

  return ip;
}

export async function middleware(req: NextRequest) {
  const checkLoginReq = new NextRequest(req.url, {
    body: "",
    method: "POST",
    headers: {
      path: "/user/checkLogin",
      "Content-Type": "application/json",
      Cookie: req.headers.get("Cookie") || "",
      fp: req.headers.get("fp") || ""
    },
  });

  const checkLoginReqResponse = await proxy(checkLoginReq);
  const resp = !checkLoginReqResponse.ok ? {} : await checkLoginReqResponse.json();
  if (!resp.success) {
    console.log(resp)
    return NextResponse.json(
      resp,
      {
        status: 401,
      },
    );
  }

  const accessCode = req.headers.get("access-code");
  const token = req.headers.get("token");
  const hashedCode = md5.hash(accessCode ?? "").trim();

  console.log("[Auth] allowed hashed codes: ", [...serverConfig.codes]);
  console.log("[Auth] got access code:", accessCode);
  console.log("[Auth] hashed access code:", hashedCode);
  console.log("[User IP] ", getIP(req));
  console.log("[Time] ", new Date().toLocaleString());

  console.log(token);
  if (serverConfig.needCode && !serverConfig.codes.has(hashedCode) && !token) {
    return NextResponse.json(
      {
        error: true,
        needAccessCode: true,
        msg: "Please go settings page and fill your access code.",
      },
      {
        status: 401,
      },
    );
  }

  // inject api key
  if (!token) {
    console.log("401",serverConfig)
    const apiKey = serverConfig.apiKey;
    if (apiKey) {
      console.log("[Auth] set system token");
      req.headers.set("token", apiKey);
    } else {
      return NextResponse.json(
        {
          error: true,
          msg: "Empty Api Key",
        },
        {
          status: 401,
        },
      );
    }
  } else {
    console.log("[Auth] set user token");
  }

  return NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
}
