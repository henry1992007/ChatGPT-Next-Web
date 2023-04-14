"use client";

import styles from "./login.module.scss";
// const Cookies = require('js-cookie')
import Cookies from "js-cookie";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  MouseEventHandler,
} from "react";

async function login(req) {
  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: {
        path: "user/login",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });

    if (response.ok) {
      let res = await response.json();
      console.log(res);
      if (res.success) {
        Cookies.set("sessionId", res.data.sessionId);
        window.location.href = "/";
      }
    }

    return response;
  } catch (err) {
    console.error("NetWork Error", err);
  }
}

export default function FirstPost() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await login({ phone: phoneNumber, pwd: password });
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>ChatGTP for Enterprise</h1>
      <input
        type="tel"
        className={styles.input}
        placeholder="请输入手机号"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <input
        type="password"
        className={styles.input}
        placeholder="请输入密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={styles.loginButton} onClick={handleLogin}>
        登录
      </button>
    </div>
  );
}
