import { AiOutlineGoogle, AiFillGithub, AiOutlineSearch } from "react-icons/ai";
import {VscSignOut} from "react-icons/vsc";

export type IconName = "google" | "github" | "search"| "signout";

type Props = {
  iconName: IconName;
  className?: string;
};

export default function Icon({ iconName, className }: Props) {
  switch (iconName) {
    case "google":
      return <AiOutlineGoogle size="1.5rem" />;
    case "github":
      return <AiFillGithub size="1.5rem" />;
    case "signout":
      return <VscSignOut size="1.5rem" />;
    case "search":
      return <AiOutlineSearch size="1.5rem" color="#6b7280" className={className} />;
    default:
      return null;
  }
}
