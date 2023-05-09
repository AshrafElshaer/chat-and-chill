import React, { type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  inputSearch?: boolean;
}

const inputSearchStyles = "w-full rounded-full bg-darkBg";

const Input = ({ className, label, inputSearch,...restProps }: Props) => {
  return (
    <div className="flex items-center  justify-between gap-2 w-full">
      {label && label !== "" ? (
        <label htmlFor={restProps.id}>{label}</label>
      ) : null}
      <input
        className={`${
          className ? className : ""
        }
        ${inputSearch ? inputSearchStyles : "rounded-lg bg-lightBg"}
        h-10  p-4 text-white outline-none`}
        {...restProps}
      />
    </div>
  );
};

export default Input;
