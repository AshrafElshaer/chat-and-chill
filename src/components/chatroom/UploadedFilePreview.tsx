import Image from "next/image";

import type { FileState } from "./ChatroomInputsContainer";
import { Icon } from "@/components";

type Props = {
  file: FileState;
  onRemove: (file: FileState) => void;
};
const UploadedFilePreview = ({ file, onRemove }: Props) => {
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
          <span className="text-darkGray absolute w-full overflow-hidden  text-xs">
            {file.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default UploadedFilePreview;
