import React, { type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
}

const Input = ({ className, label, ...restProps }: Props) => {
  return (
    <div className="relative flex  w-full items-center justify-between gap-2">
      {label && label !== "" ? (
        <label htmlFor={restProps.id}>{label}</label>
      ) : null}
      <input
        className={`
        ${className ? className : ""}
        ${
          className
            ? className.includes("bg-darkBg")
              ? "bg-darkBg"
              : "bg-lightBg"
            : ""
        }
        h-10
         p-4 text-white outline-none `}
        {...restProps}
      />
    </div>
  );
};

export default Input;
