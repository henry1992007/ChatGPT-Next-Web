"use client";

import styles from "./login.module.scss";
import electron from "@/app/electron";
import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Tabs } from "antd";
import type { TabsProps } from "antd";
import { showToast } from "../../components/ui-lib";

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
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [reqLoginCodeLoading, setReqLoginCodeLoading] =
    useState<boolean>(false);
  const [rememberPwd, setRememberPwd] = useState<boolean>(true);
  const [resetPwd, setResetPwd] = useState<boolean>(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loginCodeInterval, setLoginCodeInterval] = useState<number>(0);
  const [form] = Form.useForm<{
    phone: string;
    pwd: string;
    loginCode: string;
  }>();

  const loginCodeIntervalRef = useRef<number>();
  useEffect(() => {
    loginCodeIntervalRef.current = loginCodeInterval;
  }, [loginCodeInterval]);

  useEffect(() => {
    (async () => {
      if (electron.electron) {
        const account = await electron.readData("rememberedAccount");
        console.log("account", account);
        if (!!account) {
          const password = (await electron.getCredentials(account)) as string;
          if (!!password) {
            form.setFieldValue("phone", account);
            form.setFieldValue("pwd", password);
          }
        }
      }
    })();
  }, []);

  const handleLogin = async ({
    phone,
    pwd,
    loginCode,
  }: {
    phone: string;
    pwd: string;
    loginCode: string;
  }) => {
    setLoginLoading(true);

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
          // if (res.data.defaultPwd) {
          //   setResetPwd(true);
          //   setLoading(false);
          // } else {
          if (rememberPwd) {
            await electron.saveCredentials(phone, pwd);
            await electron.saveData("rememberedAccount", phone);
          } else {
            await electron.deleteCredentials(phone);
            await electron.deleteData("rememberedAccount");
          }
          await electron.saveData("sessionId", res.data.sessionId);
          Cookies.set("sessionId", res.data.sessionId);
          window.location.href = "/";
        } else {
          showToast(res.msg);
        }
        // }
      }
    } catch (err) {
      showToast("网络错误");
    }

    setLoginLoading(false);
  };

  const handleChangePwd = async ({
    phone,
    pwd,
    newPwd,
  }: {
    phone: string;
    pwd: string;
    newPwd: string;
  }) => {
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
    await form.validateFields(["phone"]);

    try {
      setReqLoginCodeLoading(true);
      const response = await fetch("/api/backend", {
        method: "POST",
        headers: {
          path: "/user/requestLoginCode",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: form.getFieldValue("phone") }),
      });

      if (response.ok) {
        let res = await response.json();
        if (res.success) {
          setReqLoginCodeLoading(false);
          setLoginCodeInterval(59);
          const timer = setInterval(() => {
            if (
              !!loginCodeIntervalRef.current &&
              loginCodeIntervalRef.current <= 0
            ) {
              clearInterval(timer);
            } else {
              setLoginCodeInterval((prev) => prev - 1);
            }
          }, 1000);
        }
      }
    } catch (err) {
      console.error("NetWork Error", err);
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `密码`,
      children: (
        <>
          {/*<h1 className={styles.title}>GTP ChatBot</h1>*/}
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ rememberPwd: true }}
            onFinish={handleLogin}
          >
            <Form.Item
              name="phone"
              rules={[{ required: true, message: "请输入手机号" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="手机号"
              />
            </Form.Item>
            <Form.Item
              name="pwd"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            {electron.electron ? (
              <Form.Item>
                <Form.Item name="rememberPwd" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
              </Form.Item>
            ) : null}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loginLoading}
                style={{ width: "100%", background: "var(--primary)" }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </>
      ),
    },
    {
      key: "2",
      label: `验证码`,
      children: (
        <>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ rememberPwd: true }}
            onFinish={handleLogin}
            form={form}
          >
            <Form.Item
              name="phone"
              rules={[{ required: true, message: "请输入手机号" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="手机号"
              />
            </Form.Item>
            <Form.Item
              name="loginCode"
              rules={[{ required: true, message: "请输入验证码" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="验证码"
              />
            </Form.Item>
            <Form.Item>
              {electron.electron ? (
                <Form.Item name="rememberPwd" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
              ) : null}
              <Button
                type="link"
                className="login-form-button"
                loading={reqLoginCodeLoading}
                style={{ padding: "0" }}
                onClick={requestLoginCode}
                disabled={loginCodeInterval > 0}
              >
                {loginCodeInterval > 0
                  ? loginCodeInterval + "秒后重试"
                  : "获取验证码"}
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loginLoading}
                style={{ width: "100%" }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </>
      ),
    },
  ];

  // return resetPwd ? (
  // return false ? (
  //   <div className={styles.loginContainer}>
  //     <h1 className={styles.title}>GTP ChatBot</h1>
  //     <input
  //       type="tel"
  //       className={styles.input}
  //       placeholder="请输入手机号"
  //       value={phone}
  //     />
  //     <input
  //       type="password"
  //       className={styles.input}
  //       placeholder="请输入新密码"
  //       value={newPwd}
  //       onChange={(e) => setNewPwd(e.target.value)}
  //     />
  //     <input
  //       type="password"
  //       className={styles.input}
  //       placeholder="确认密码"
  //       value={confirmPwd}
  //       onChange={(e) => setConfirmPwd(e.target.value)}
  //     />
  //     <button
  //       className={styles.loginButton}
  //       onClick={handleChangePwd}
  //       disabled={loading}
  //     >
  //       修改密码
  //     </button>
  //   </div>
  // ) : (
  //   <>
  //     {/*<h1 className={styles.title}>GTP ChatBot</h1>*/}
  return <Tabs defaultActiveKey="1" items={items} style={{ color: "" }} />;
  // {/*</>*/}
  // );
}
