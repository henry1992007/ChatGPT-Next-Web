import { useEffect, useState } from "react";

import styles from "./my.module.scss";
import CloseIcon from "../icons/close.svg";
import { List, ListItem, showToast } from "./ui-lib";

import { IconButton } from "./button";

import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useNavigate } from "react-router-dom";
import fingerprint from "@fingerprintjs/fingerprintjs";
import { Loading } from "@/app/components/home";

export function My() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<{
    phone?: string;
    userName?: string;
    subscription?: number;
    subscriptionDesc?: string;
    subscriptionExpire?: string;
  }>({});

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/backend", {
        method: "POST",
        headers: {
          path: "/user/profile",
          "Content-Type": "application/json",
          fp: (await (await fingerprint.load()).get()).visitorId,
        },
      });

      if (response.ok) {
        let res = await response.json();
        if (res.success) {
          setProfile(res.data);
          setLoading(false);
        } else {
          showToast("res.msg");
        }
      } else {
        showToast("网络错误");
      }
    })();
  }, []);

  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(Path.Home);
      }
    };
    document.addEventListener("keydown", keydownEvent);
    return () => {
      document.removeEventListener("keydown", keydownEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <div className="window-header">
        <div className="window-header-title">
          <div className="window-header-main-title">{Locale.My.Title}</div>
        </div>
        <div className="window-actions">
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
              title={Locale.Settings.Actions.Close}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <Loading noLogo />
      ) : (
        <div className={styles["settings"]}>
          <List>
            <ListItem title={"用户名"}>
              <span>{profile.userName}</span>
            </ListItem>
            <ListItem title={"手机号"}>
              <span>{profile.phone}</span>
            </ListItem>
            <ListItem
              title={"我的等级"}
              subTitle={"到期：" + profile.subscriptionExpire}
            >
              <span>{profile.subscriptionDesc}</span>
            </ListItem>
          </List>
        </div>
      )}
    </ErrorBoundary>
  );
}
