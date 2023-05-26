import React, { type InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
}

const Input = ({ className, label, ...restProps }: Props) => {

  const styles = twMerge(
    `h-10
    p-4 text-white outline-none bg-lightBg`,
    className
  )
  return (
    <div className="relative flex  w-full items-center justify-between gap-2">
      {label && label !== "" ? (
        <label htmlFor={restProps.id}>{label}</label>
      ) : null}
      <input
        className={styles}
        {...restProps}
      />
    </div>
  );
};

export default Input;
