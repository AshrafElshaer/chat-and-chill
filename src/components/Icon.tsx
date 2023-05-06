import { type } from "os";
import { AiOutlineGoogle, AiFillGithub } from "react-icons/ai";

export type IconName = "google" | "github";

type Props = {
  iconName: IconName;
};

export default function Icon({ iconName }: Props) {
  switch (iconName) {
    case "google":
      return <AiOutlineGoogle size="1.5rem" />;
    case "github":
      return <AiFillGithub size="1.5rem" />;
    default:
      return null;
  }
}
