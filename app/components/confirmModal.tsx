import { Prompt, SearchService, usePromptStore } from "@/app/store/prompt";
import { useEffect, useState } from "react";
import { Modal } from "@/app/components/ui-lib";
import Locale from "@/app/locales";
import { IconButton } from "@/app/components/button";
import AddIcon from "@/app/icons/add.svg";
import styles from "@/app/components/settings.module.scss";
import ClearIcon from "@/app/icons/clear.svg";
import EditIcon from "@/app/icons/edit.svg";
import EyeIcon from "@/app/icons/eye.svg";
import CopyIcon from "@/app/icons/copy.svg";
import { copyToClipboard } from "@/app/utils";

export default function ConfirmModal({ onOk = () => {}, onClose = () => {} }) {
  const promptStore = usePromptStore();
  const userPrompts = promptStore.getUserPrompts();
  const builtinPrompts = SearchService.builtinPrompts;
  const allPrompts = userPrompts.concat(builtinPrompts);
  const [searchInput, setSearchInput] = useState("");
  const [searchPrompts, setSearchPrompts] = useState<Prompt[]>([]);
  const prompts = searchInput.length > 0 ? searchPrompts : allPrompts;

  const [editingPromptId, setEditingPromptId] = useState<number>();

  useEffect(() => {
    if (searchInput.length > 0) {
      const searchResult = SearchService.search(searchInput);
      setSearchPrompts(searchResult);
    } else {
      setSearchPrompts([]);
    }
  }, [searchInput]);

  return (
    <div className="modal-mask">
      <Modal
        title={Locale.Settings.Prompt.Modal.Title}
        onClose={() => onClose()}
        actions={[
          <IconButton
            type={"primary"}
            key="add"
            onClick={onOk}
            bordered
            text="确定"
          />,
        ]}
      >
        <span>确定？</span>
      </Modal>
    </div>
  );
}
