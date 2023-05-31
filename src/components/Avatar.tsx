import Image from "next/image";
import React from "react";

type Props = {
  src: string;
  isOnline: boolean;
  width?: number;
  height?: number;
};

const Avatar = ({ isOnline, src, width = 40, height = 40 }: Props) => {
  return (
    <div className="relative ">
      <Image
        src={src}
        alt="user profile picture"
        width={width}
        height={height}
        className=" rounded-full ring-2 ring-gray-800"
      />
      {isOnline && (
        <span className="absolute right-0 top-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
      )}
    </div>
  );
};

export default Avatar;
