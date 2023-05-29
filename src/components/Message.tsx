import type { File, Message, User } from "@prisma/client";
import React from "react";
import Icon from "./Icon";
import Image from "next/image";
import { toast } from "react-toastify";

type Props = {
  message: Message & { user: User; files: File[] };
  userId: number;
};

const MessageComponent = ({ message, userId }: Props) => {
  return (
    <div
      className={`w-fit max-w-prose ${
        message.userId === userId ? "ml-auto" : ""
      }`}
    >
      <div
        className={`mb-1  mt-4 rounded-md px-4 py-2 leading-relaxed ${
          message.userId === userId ? "bg-blue" : "bg-lightBg"
        }`}
      >
        <span>{message.text}</span>
      </div>
      {message.files && message.files.length > 0 && (
        <div className="flex w-full gap-x-2 gap-y-6 rounded-md bg-lightBg">
          {message.files.map((file) => (
            <FilePreview key={file.id} file={file} />
          ))}
        </div>
      )}

      <span className="text-xs text-gray-500">
        {getDaysAgo(new Date(message.createdAt)) > 1
          ? `${getDaysAgo(new Date(message.createdAt))} days ago`
          : new Date(message.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
      </span>
    </div>
  );
};

export default MessageComponent;

export const getDaysAgo = (date: Date) => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

function FilePreview({ file }: { file: File }) {
  async function downloadFile(path: string) {
    try {
      const res = await fetch(`/api/files/download?path=${path}`, {
        method: "POST",
      });
      const isSuccessful = res.status === 200;
      if (isSuccessful) {
        toast.success("File downloaded successfully");
      }
    } catch (err) {
      toast.error("File download failed");
    }
  }
  return (
    <div className="  p-2">
      {file.type.includes("image") && (
        <Image
          className="aspect-square h-16 rounded-md"
          src={file.url}
          alt={file.name}
          width={64}
          height={64}
          onClick={() => void downloadFile(file.path)}
        />
      )}
      {file.type.includes("pdf") && (
        <div
          className=" relative aspect-square h-16 items-center overflow-hidden  rounded-md "
          onClick={() => window.open(file.url, "_blank")}
        >
          <Icon
            iconName="pdf"
            className=" rounded-lg bg-black p-2"
            size="4rem"
          />
          <span className="text-darkGray absolute w-full overflow-hidden  text-xs">
            {file.name}
          </span>
        </div>
      )}
    </div>
  );
}
