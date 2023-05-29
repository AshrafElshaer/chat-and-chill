import { useDropzone } from "react-dropzone";

import type { FileState } from "@/pages/chatroom/[id]";
import type { SetState } from "./sidebar/Sidebar";
import { useEffect } from "react";
import FilePreview from "./FilePreview";
import { uploadFileToStorage } from "@/utils/supabase";

type Props = {
  setUploadedFiles: SetState<FileState[]>;
  uploadedFiles: FileState[];
};

const Uploader = ({ setUploadedFiles, uploadedFiles }: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles((curr) => [
        ...curr,
        ...acceptedFiles.map((file) => {
          console.log(file);
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        }),
      ]);
    },
    maxFiles: 8,
    maxSize: 20000000, // 20MB
    accept: {
      "image/*": [],
      // "video/*": [],
      // "audio/*": [],
      "application/pdf": [],
    },
    noKeyboard: true,
  });

  function removeFile(file: FileState) {
    setUploadedFiles((curr) => curr.filter((f) => f.name !== file.name));
  }
 



  return (
    <section className="h-full rounded-lg bg-lightBg">
      <div
        {...getRootProps({
          className: `bg-lightBg  p-4 border-2 border-dashed border-gray-400 rounded-lg  cursor-pointer grid place-content-center ${
            uploadedFiles.length ? "h-1/4" : "h-full"
          }   `,
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-center">Drop the files here ...</p>
        ) : (
          <p className="grid place-content-center text-center ">
            Drag & drop some files here, or click to select files
          </p>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="  flex h-3/4 flex-grow flex-wrap items-start justify-start gap-x-2 gap-y-8  overflow-hidden p-4">
          {uploadedFiles.map((file, idx) => (
            <FilePreview key={idx} file={file} onRemove={removeFile} />
          ))}
        </div>
      )}
      
    </section>
  );
};

export default Uploader;
