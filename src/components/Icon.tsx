import { AiOutlineGoogle, AiFillGithub, AiOutlineSearch } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";
import { BsEmojiSmile, BsFiletypePdf } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";

export type IconName =
  | "google"
  | "github"
  | "search"
  | "signout"
  | "emoji"
  | "attachment"
  | "pdf";

type Props = {
  iconName: IconName;
  className?: string;
  size?: string;
};

export default function Icon({ iconName, className = "" ,size}: Props) {
  switch (iconName) {
    case "google":
      return <AiOutlineGoogle size="1.5rem" />;
    case "github":
      return <AiFillGithub size="1.5rem" />;
    case "signout":
      return <VscSignOut size="1.5rem" />;
    case "search":
      return (
        <AiOutlineSearch size="1.5rem" color="#6b7280" className={className} />
      );
    case "emoji":
      return (
        <BsEmojiSmile size="1.5rem" color="#7C7878" className={className} />
      );
    case "attachment":
      return (
        <ImAttachment
          size="1.5rem"
          color="currentColor"
          className={className}
        />
      );
    case "pdf":
      return <BsFiletypePdf color="currentColor" className={className} size={size} />;
    default:
      return null;
  }
}
