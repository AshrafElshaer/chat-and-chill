import Image from "next/image";
import React from "react";
import type { FileState } from "@/pages/chatroom/[id]";
import Icon from "./Icon";

type Props = {
  file: FileState;
  onRemove: (file: FileState) => void;
};
const FilePreview = ({ file, onRemove }: Props) => {
  return (
    <div className="relative">
      <button
        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white"
        onClick={() => onRemove(file)}
      >
        x
      </button>
      {file.type.includes("image") && (
        <Image
          className="aspect-square h-16 rounded-md"
          src={file.preview}
          alt={file.name}
          width={64}
          height={64}
          onLoad={() => URL.revokeObjectURL(file.preview)}
        />
      )}
      {file.type.includes("pdf") && (
        <div className=" aspect-square h-16 items-center  rounded-md ">
          <Icon
            iconName="pdf"
            className=" rounded-lg bg-black p-2"
            size="4rem"
          />
          <span className="absolute text-xs w-full overflow-hidden  text-darkGray">{file.name}</span>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
