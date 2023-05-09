import { AiOutlineGoogle, AiFillGithub, AiOutlineSearch } from "react-icons/ai";

export type IconName = "google" | "github" | "search";

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
    case "search":
      return <AiOutlineSearch size="1.5rem" color="#6b7280" className={className} />;
    default:
      return null;
  }
}
