import { type ButtonHTMLAttributes } from "react";
import Icon, { type IconName } from "./Icon";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  icon?: IconName;
}

const Button = ({ children, icon, ...restProps }: Props) => {
  return (
    <button
      className="my-4 flex h-10 w-full items-center  justify-center gap-4 rounded-lg bg-lightBg p-4 text-sm text-white outline-none hover:bg-lightGray/30 disabled:cursor-not-allowed disabled:bg-lightGray/30 disabled:text-lightGray/50 disabled:hover:bg-lightGray/30 disabled:hover:text-lightGray/50"
      {...restProps}
    >
      {icon ? <Icon iconName={icon} /> : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
