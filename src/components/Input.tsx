import React, { type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
}

const Input = ({ className, label, ...restProps }: Props) => {
  return (
    <div className="flex items-center  justify-between gap-2 w-full">
      {label && label !== "" ? (
        <label htmlFor={restProps.id}>{label}</label>
      ) : null}
      <input
        className={`h-10 rounded-lg bg-lightBg p-4 text-white outline-none   ${
          className ? className : ""
        }`}
        {...restProps}
      />
    </div>
  );
};

export default Input;
