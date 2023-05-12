"use client";

import fingerprint from "@fingerprintjs/fingerprintjs";

require("../polyfill");

import { useState, useEffect } from "react";

import styles from "./home.module.scss";

import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";

import { getCSSVar, useMobileScreen } from "../utils";

import dynamic from "next/dynamic";
import { Path, SlotID } from "../constant";
import { ErrorBoundary } from "./error";

const Cookies = require("js-cookie");

import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { SideBar } from "./sidebar";
import { useAppConfig } from "../store/config";
import electron from "@/app/electron";
import { useMaskStore } from "../store/mask";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"] + " no-dark"}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

const Chat = dynamic(async () => (await import("./chat")).Chat, {
  loading: () => <Loading noLogo />,
});

const NewChat = dynamic(async () => (await import("./new-chat")).NewChat, {
  loading: () => <Loading noLogo />,
});

const MaskPage = dynamic(async () => (await import("./mask")).MaskPage, {
  loading: () => <Loading noLogo />,
});

const My = dynamic(async () => (await import("./my")).My, {
  loading: () => <Loading noLogo />,
});

export function useSwitchTheme() {
  const config = useAppConfig();

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector(
      'meta[name="theme-color"][media]',
    );
    const metaDescriptionLight = document.querySelector(
      'meta[name="theme-color"]:not([media])',
    );

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      const themeColor = getCSSVar("--themeColor");
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

function Screen() {
  const config = useAppConfig();
  const location = useLocation();
  const isHome = location.pathname === Path.Home;
  const isMobileScreen = useMobileScreen();

  return (
    <div
      className={
        styles.container +
        ` ${
          config.tightBorder && !isMobileScreen
            ? styles["tight-container"]
            : styles.container
        }`
      }
    >
      <SideBar className={isHome ? styles["sidebar-show"] : ""} />

      <div className={styles["window-content"]} id={SlotID.AppBody}>
        <Routes>
          <Route path={Path.Home} element={<Chat />} />
          <Route path={Path.NewChat} element={<NewChat />} />
          <Route path={Path.Masks} element={<MaskPage />} />
          <Route path={Path.Chat} element={<Chat />} />
          <Route path={Path.Settings} element={<Settings />} />
          <Route path={Path.My} element={<My />} />
        </Routes>
      </div>
    </div>
  );
}

export function Home() {
  const checkingSession = useCheckSession();
  const useHasHydrated_ = useHasHydrated();
  useSwitchTheme();

  if (checkingSession || !useHasHydrated_) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Screen />
      </Router>
    </ErrorBoundary>
  );
}

function useCheckSession() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (electron.electron) {
        let sid = await electron.readData("sessionId");
        if (sid) {
          Cookies.set("sessionId", sid);
        }
      }
      const sessionId = Cookies.get("sessionId");
      if (!sessionId) {
        window.location.href = "/user/login"; // 重定向到登录URL
      } else {
        const isValid = await validateSession();
        if (!isValid) {
          window.location.href = "/user/login"; // 重定向到登录URL
        } else {
          setLoading(false);
        }
      }
    })();
  }, []);

  return loading;
}

async function validateSession() {
  const response = await fetch("/api/backend", {
    method: "POST",
    headers: {
      path: "/user/checkLogin",
      "Content-Type": "application/json",
      fp: (await (await fingerprint.load()).get()).visitorId,
    },
  });

  if (response.ok) {
    let res = await response.json();
    if (res.success) {
      // display phone res.data.phone
      return true;
    }
  }

  return false;
}
