"use client";

import styles from "./login.module.scss";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  MouseEventHandler,
} from "react";

export default function FirstPost() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 处理登录逻辑
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
