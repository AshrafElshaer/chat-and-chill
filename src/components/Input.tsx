import React, { type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className, ...restProps }: Props) => {
  return (
    <input
      className={`h-10 w-full rounded-lg bg-lightBg p-4 text-white outline-none  ${
        className ? className : ""
      }`}
      {...restProps}
    />
  );
};

export default Input;
