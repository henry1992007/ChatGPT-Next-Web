import { useEffect, useState } from "react";

import styles from "./my.module.scss";
import CloseIcon from "../icons/close.svg";
import { Input, List, ListItem, Modal, showToast } from "./ui-lib";

import { IconButton } from "./button";
import StartUpIcon from "../icons/rocket.svg";
import PurchaseIcon from "../icons/purchase.svg";

import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useNavigate } from "react-router-dom";
import fingerprint from "@fingerprintjs/fingerprintjs";
import { Loading } from "@/app/components/home";
import AddIcon from "@/app/icons/add.svg";
import { Prompt, SearchService, usePromptStore } from "@/app/store/prompt";
import ClearIcon from "@/app/icons/clear.svg";
import EditIcon from "@/app/icons/edit.svg";
import EyeIcon from "@/app/icons/eye.svg";
import CopyIcon from "@/app/icons/copy.svg";
import Smile1 from "@/app/icons/1F604.svg";
import Smile2 from "@/app/icons/1F606.svg";
import Smile3 from "@/app/icons/1F929.svg";
import { copyToClipboard } from "@/app/utils";

export function My() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
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
          showToast(res.msg);
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
          <div className="window-header-main-title">{"我的"}</div>
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
              <div style={{ display: "flex", gap: "20px" }}>
                <span style={{ marginTop: "5px" }}>
                  {profile.subscriptionDesc}
                </span>
                <IconButton
                  icon={<StartUpIcon />}
                  text={"升级"}
                  onClick={() => setShowUpgradeModal(true)}
                  shadow
                  type={"primary"}
                />
              </div>
            </ListItem>
          </List>
        </div>
      )}

      {showUpgradeModal && (
        <UpgradeModal
          showPayModal={() => setShowPayModal(true)}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
      {showPayModal && <PayModal onClose={() => setShowPayModal(false)} />}
    </ErrorBoundary>
  );
}

function UpgradeModal(props: {
  id: number;
  onClose: () => void;
  showPayModal: () => void;
}) {
  const lv1Plan = [
    {
      name: "月度 19¥/月",
      code: "lv1month",
      unit: 19,
      total: 19,
      icon: <Smile1 />,
    },
    {
      name: "半年度 18¥/月",
      code: "lv1semi",
      unit: 18,
      total: 108,
      icon: <Smile2 />,
    },
    {
      name: "年度 17¥/月",
      code: "lv1annual",
      unit: 17,
      total: 204,
      icon: <Smile3 />,
    },
  ];
  const [selectedPlan, setSelectedPlan] = useState(lv1Plan[2]);
  const [editingPromptId, setEditingPromptId] = useState<number>();

  return (
    <div className="modal-mask">
      <Modal
        title={"升级"}
        onClose={() => props.onClose?.()}
        actions={[
          <span key={"total"} style={{ fontSize: "25px" }}>
            {selectedPlan.total}¥
          </span>,
          <IconButton
            key="add"
            onClick={props.showPayModal}
            icon={<PurchaseIcon />}
            bordered
            text={"购买"}
            textSize={15}
          />,
        ]}
      >
        <div className={styles["user-prompt-modal"]}>
          <div className={styles["user-prompt-list"]}>
            {/*{prompts.map((v, _) => (*/}
            <div className={styles["user-prompt-item"]} key={"Lv.1"}>
              <div className={styles["user-prompt-header"]}>
                <div className={styles["user-prompt-title"]}>Lv.1</div>
                <div className={styles["user-prompt-content"] + " one-line"}>
                  使用所用gpt3.5功能
                </div>
              </div>

              <div className={styles["user-prompt-buttons"]}>
                {/*{v.isUser && (*/}
                {/*  <IconButton*/}
                {/*    icon={<ClearIcon />}*/}
                {/*    className={styles["user-prompt-button"]}*/}
                {/*    onClick={() => promptStore.remove(v.id!)}*/}
                {/*  />*/}
                {/*)}*/}
                {/*{v.isUser ? (*/}
                {/*  <IconButton*/}
                {/*    icon={<EditIcon />}*/}
                {/*    className={styles["user-prompt-button"]}*/}
                {/*    onClick={() => setEditingPromptId(v.id)}*/}
                {/*  />*/}
                {/*) :*/}
                {/*  (*/}
                {/*  <IconButton*/}
                {/*    icon={<EyeIcon />}*/}
                {/*    className={styles["user-prompt-button"]}*/}
                {/*    onClick={() => setEditingPromptId(v.id)}*/}
                {/*  />*/}
                {/*)}*/}
                {lv1Plan.map((p) => (
                  <IconButton
                    key={p.name}
                    icon={p.icon}
                    className={styles["user-prompt-button"]}
                    onClick={() => setSelectedPlan(p)}
                    text={p.name}
                    textSize={15}
                    bordered
                    type={selectedPlan.code === p.code ? "primary" : undefined}
                  />
                ))}
              </div>
            </div>
            {/*))}*/}
          </div>
        </div>
      </Modal>

      {/*{editingPromptId !== undefined && (*/}
      {/*  <EditPromptModal*/}
      {/*    id={editingPromptId!}*/}
      {/*    onClose={() => setEditingPromptId(undefined)}*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  );
}

function PayModal(props: { id: number; onClose: () => void }) {
  const [selectedPay, setSelectedPay] = useState("alipay");

  return (
    <div className="modal-mask">
      <Modal
        title={"选择支付方式"}
        onClose={() => props.onClose?.()}
        actions={[
          <IconButton
            key="add"
            onClick={() => {}}
            icon={<PurchaseIcon />}
            bordered
            text={"支付"}
            textSize={15}
          />,
          <IconButton
            key="add"
            onClick={props.onClose}
            bordered
            text={"取消"}
            textSize={15}
          />,
        ]}
      >
        <div className={styles["user-prompt-modal"]}>
          <div className={styles["user-prompt-list"]}>
            <div
              className={styles["user-prompt-item"]}
              style={{ cursor: "pointer" }}
              key={"alipay"}
              onClick={() => setSelectedPay("alipay")}
            >
              <div className={styles["user-prompt-header"]}>
                <div className={styles["user-prompt-title"]}>支付宝</div>
              </div>
              <div className={styles["user-prompt-buttons"]}>
                <input type={"radio"} checked={selectedPay === "alipay"} />
              </div>
            </div>
          </div>
          <div className={styles["user-prompt-list"]}>
            <div
              className={styles["user-prompt-item"]}
              style={{ cursor: "pointer" }}
              key={"weixin"}
              onClick={() => setSelectedPay("weixin")}
            >
              <div className={styles["user-prompt-header"]}>
                <div className={styles["user-prompt-title"]}>微信</div>
              </div>
              <div className={styles["user-prompt-buttons"]}>
                <input type={"radio"} checked={selectedPay === "weixin"} />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/*{editingPromptId !== undefined && (*/}
      {/*  <EditPromptModal*/}
      {/*    id={editingPromptId!}*/}
      {/*    onClose={() => setEditingPromptId(undefined)}*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  );
}
