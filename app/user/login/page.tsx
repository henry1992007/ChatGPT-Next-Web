"use client";

import styles from "./login.module.scss";
const Cookies = require("js-cookie");

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  MouseEventHandler,
} from "react";

export default function FirstPost() {
  const [loading, setLoading] = useState<boolean>(false);
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [resetPwd, setResetPwd] = useState<boolean>(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          path: "user/login",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, pwd }),
      });

      if (response.ok) {
        setLoading(false);
        let res = await response.json();
        console.log(res);
        if (res.success) {
          if (res.data.defaultPwd) {
            setResetPwd(true);
          } else {
            Cookies.set("sessionId", res.data.sessionId);
            window.location.href = "/";
          }
        }
      }
    } catch (err) {
      console.error("NetWork Error", err);
    }
  };

  const handleChangePwd = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          path: "/user/updatePwd",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, oldPwd: pwd, newPwd }),
      });

      if (response.ok) {
        setLoading(false);
        let res = await response.json();
        console.log(res);
        if (res.success) {
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("NetWork Error", err);
    }
  };

  return resetPwd ? (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>ChatGTP for Enterprise</h1>
      <input
        type="tel"
        className={styles.input}
        placeholder="请输入手机号"
        value={phone}
      />
      <input
        type="password"
        className={styles.input}
        placeholder="请输入新密码"
        value={newPwd}
        onChange={(e) => setNewPwd(e.target.value)}
      />
      <input
        type="password"
        className={styles.input}
        placeholder="确认密码"
        value={confirmPwd}
        onChange={(e) => setConfirmPwd(e.target.value)}
      />
      <button
        className={styles.loginButton}
        onClick={handleChangePwd}
        disabled={loading}
      >
        修改密码
      </button>
    </div>
  ) : (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>ChatGTP for Enterprise</h1>
      <input
        type="tel"
        className={styles.input}
        placeholder="请输入手机号"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="password"
        className={styles.input}
        placeholder="请输入密码"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      <button
        className={styles.loginButton}
        onClick={handleLogin}
        disabled={loading}
      >
        登录
      </button>
    </div>
  );
}
