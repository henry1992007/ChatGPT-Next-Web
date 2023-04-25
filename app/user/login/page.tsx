"use client";

import styles from "./login.module.scss";
import { Loading } from "../../components/home";
import electron from "@/app/electron";

const Cookies = require("js-cookie");

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  MouseEventHandler,
} from "react";
import fingerprint from "@fingerprintjs/fingerprintjs";

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [rememberPwd, setRememberPwd] = useState<boolean>(true);
  const [resetPwd, setResetPwd] = useState<boolean>(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [useLoginCode, setUseLoginCode] = useState<boolean>(true);
  const [loginCode, setLoginCode] = useState<string>();

  useEffect(() => {
    (async () => {
      if (electron.electron) {
        const account = await electron.readData("rememberedAccount");
        console.log("account", account);
        if (!!account) {
          const password = (await electron.getCredentials(account)) as string;
          if (!!password) {
            setPhone(account);
            setPwd(password);
          }
        }
      }
    })();
  }, []);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/backend", {
        method: "POST",
        headers: {
          path: "user/login",
          "Content-Type": "application/json",
          fp: (await (await fingerprint.load()).get()).visitorId,
        },
        body: JSON.stringify({ phone, pwd, loginCode }),
      });

      if (response.ok) {
        let res = await response.json();
        if (res.success) {
          if (res.data.defaultPwd) {
            setResetPwd(true);
            setLoading(false);
          } else {
            if (rememberPwd) {
              await electron.saveCredentials(phone, pwd);
              await electron.saveData("rememberedAccount", phone);
            } else {
              await electron.deleteCredentials(phone);
              // await electron.saveData('rememberedAccount', null);
            }
            await electron.saveData("sessionId", res.data.sessionId);
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
      const response = await fetch("/api/backend", {
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

  const requestLoginCode = async () => {
    try {
      const response = await fetch("/api/backend", {
        method: "POST",
        headers: {
          path: "/user/requestLoginCode",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      if (response.ok) {
        // setLoading(false);
        // let res = await response.json();
        // console.log(res);
        // if (res.success) {
        //   window.location.reload();
        // }
      }
    } catch (err) {
      console.error("NetWork Error", err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return resetPwd ? (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>GTP ChatBot</h1>
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
      <h1 className={styles.title}>GTP ChatBot</h1>
      <input
        type="tel"
        className={styles.input}
        placeholder="请输入手机号"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {useLoginCode ? (
        <input
          type="tel"
          className={styles.input}
          placeholder="请输入验证码"
          value={loginCode}
          onChange={(e) => setLoginCode(e.target.value)}
        />
      ) : (
        <input
          type="password"
          className={styles.password}
          placeholder="请输入密码"
          value={pwd}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          onChange={(e) => setPwd(e.target.value)}
        />
      )}
      {useLoginCode && (
        <button
          id="send-code"
          className={styles.loginButton}
          onClick={requestLoginCode}
        >
          发送验证码
        </button>
      )}
      {electron.electron && !useLoginCode ? (
        <div>
          <input
            id="exampleCheckbox"
            type="checkbox"
            checked={rememberPwd}
            onChange={(e) => setRememberPwd(e.target.checked)}
          />
          <label htmlFor="exampleCheckbox">记住密码</label>
        </div>
      ) : null}
      <button
        className={styles.loginButton}
        onClick={handleLogin}
        disabled={loading}
      >
        登录
      </button>
      <button
        className={styles.switchButton}
        onClick={() => setUseLoginCode(!useLoginCode)}
      >
        {useLoginCode ? "使用密码登录" : "使用验证码登录"}
      </button>
    </div>
  );
}
