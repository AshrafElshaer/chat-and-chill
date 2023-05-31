import React from "react";
import { toast } from "react-toastify";
import type { File, Message, User } from "@prisma/client";
import { Icon } from "@/components";
import Image from "next/image";

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
      {message.text !== "" ? (
        <div
          className={`mb-1  mt-4 rounded-md px-4 py-2 leading-relaxed ${
            message.userId === userId ? "bg-blue" : "bg-lightBg"
          }`}
        >
          <span>{message.text}</span>
        </div>
      ) : null}

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

export function FilePreview({
  file,
  width = 64,
  height = 64,
  iconSize = "4rem",
}: {
  file: File;
  width?: number;
  height?: number;
  iconSize?: string;
}) {
  async function downloadFile() {
    // checking if used browser is mobile browser
    if (window.navigator.userAgent.match(/Mobile/)) {
      return window.open(file.url, "_blank");
    }

    const res = await downloadPromise(file.url, file.name);
    if (res instanceof Error) return toast.error("Downloading file failed");
    toast.success("File downloaded successfully");
  }
  return (
    <div className="p-2">
      {file.type.includes("image") && (
        <Image
          className="aspect-square cursor-pointer rounded-md"
          src={file.url}
          alt={file.name}
          width={width}
          height={height}
          onClick={() => void downloadFile()}
        />
      )}
      {file.type.includes("pdf") && (
        <div
          className=" relative aspect-square h-auto cursor-pointer grid place-content-center  overflow-hidden rounded-md "
          onClick={() => window.open(file.url, "_blank")}
        >
          <Icon
            iconName="pdf"
            className=" rounded-lg bg-black p-2"
            size={iconSize}
          />
         
        </div>
      )}
    </div>
  );
}

async function downloadPromise(url: string, name: string) {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one");
  }

  return await fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;
      a.style.display = " none";

      if (name && name.length) a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return true;
    })
    .catch((err: Error) => err);
}
