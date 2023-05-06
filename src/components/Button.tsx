import { type ButtonHTMLAttributes } from "react";
import { type IconName, createIcon } from "./Icon";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  icon?: IconName;
}

const Button = ({ children, icon, ...restProps }: Props) => {
  return (
    <button
      className="my-4 flex h-10 w-full items-center  justify-center gap-4 rounded-lg bg-lightBg p-4 text-sm text-white outline-none hover:bg-lightGray/30"
      {...restProps}
    >
      {icon ? createIcon(icon) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;