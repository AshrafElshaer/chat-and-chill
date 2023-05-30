import  {  useState } from "react";
import { api } from "@/utils/api";
import { uploadFileToStorage } from "@/utils/supabase";
import { toast } from "react-toastify";

import type {ChangeEvent, FormEvent } from "react";
import type { EmojiClickData } from "emoji-picker-react";

import EmojiPicker , { EmojiStyle, Theme }from "emoji-picker-react";
import Uploader from "./Uploader";
import Icon from "./Icon";
import Input from "./Input";

type Props = {
  roomId: number;
};

export interface FileState extends File {
  preview: string;
}

interface UploadedFile {
  name: string;
  type: string;
  url: string;
  path: string;
}
const ChatroomInputsContainer = ({ roomId }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileState[]>([]);
  const { mutateAsync: sendNewMessage } =
    api.messages.sendNewMessage.useMutation();

  function handleEmojiClick(emojiObject: EmojiClickData, e: MouseEvent) {
    setIsUploaderOpen(false);
    setNewMessage((curr) => curr + emojiObject.emoji);
  }
  function toggleEmojiPicker() {
    setIsUploaderOpen(false);
    setIsEmojiPickerOpen((curr) => !curr);
  }
  function toggleUploader() {
    setIsEmojiPickerOpen(false);
    setIsUploaderOpen((curr) => !curr);
  }
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setNewMessage(e.target.value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!uploadedFiles.length) {
      if (!newMessage) return;
    }

    setIsEmojiPickerOpen(false);
    setIsUploaderOpen(false);

    const uploadedfilesToStorage: UploadedFile[] = [];
    for (const file of uploadedFiles) {
      const uploadedFile = await uploadFileToStorage(file);

      if (uploadedFile instanceof Error) {
        toast.error(uploadedFile.message);
        return;
      }

      uploadedfilesToStorage.push(uploadedFile);
    }

    await sendNewMessage({
      text: newMessage,
      chatroomId: roomId,
      files: uploadedfilesToStorage,
    });

    setUploadedFiles([]);
    setNewMessage("");
  }

  return (
    <div className="relative">
      {isEmojiPickerOpen && (
        <div className="absolute bottom-16 left-6  md:left-4 ">
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={handleEmojiClick}
            emojiStyle={EmojiStyle.APPLE}
          />
        </div>
      )}
      {isUploaderOpen && (
        <div
          className={`absolute bottom-20 left-1/2  ${
            uploadedFiles.length ? "h-auto" : "h-56"
          }  w-4/5  -translate-x-1/2 `}
        >
          <Uploader
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
          />
        </div>
      )}

      <form
        className=" relative flex items-center justify-between gap-4 p-4"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <button
          className="absolute  left-6 z-20"
          type="button"
          onClick={toggleEmojiPicker}
        >
          <Icon iconName="emoji" />
        </button>
        <Input
          placeholder="Type a message"
          className="w-full rounded-full pl-12 "
          value={newMessage}
          onChange={handleInputChange}
        />
        <button
          className={`absolute right-6 z-20 ${
            uploadedFiles.length > 0 ? "text-green-500" : "text-darkGrey"
          }`}
          type="button"
          onClick={toggleUploader}
        >
          {uploadedFiles.length > 0 ? (
            <span className="absolute -top-8 grid h-6 w-6  place-content-center rounded-full bg-green-950 text-sm  text-white">
              {uploadedFiles.length}
            </span>
          ) : (
            ""
          )}
          <Icon iconName="attachment" />
        </button>
      </form>
    </div>
  );
};

export default ChatroomInputsContainer;
