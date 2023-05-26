import type { ReactNode, ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import Icon, { type IconName } from "./Icon";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: IconName;
  className?: string;
  buttonType?: ButtonType;
}

type ButtonType = keyof typeof buttonTypes;

const buttonTypes = {
  primary: "bg-lightBg",
  secondary: "bg-black",
};

const Button = ({
  children,
  icon,
  className,
  buttonType = "primary",
  ...restProps
}: Props) => {
  const styles = twMerge(
    `${buttonTypes[buttonType]} my-4 flex h-10 w-full items-center justify-center  gap-4 rounded-lg  p-4 text-sm text-white outline-none hover:bg-lightGray/30 disabled:cursor-not-allowed disabled:bg-lightGray/30 disabled:text-lightGray/50 disabled:hover:bg-lightGray/30 disabled:hover:text-lightGray/50 `,
    className
  );
  return (
    <button className={styles} {...restProps}>
      {icon ? <Icon iconName={icon} /> : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
