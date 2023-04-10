"use client";

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // onLogin(phoneNumber, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="tel"
        placeholder="手机号"
        value={phoneNumber}
        onChange={(event) => setPhoneNumber(event.target.value)}
      />
      <input
        type="password"
        placeholder="密码"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit">登录</button>
    </form>
  );
}
