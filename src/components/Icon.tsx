
import { AiOutlineGoogle, AiFillGithub } from "react-icons/ai";


export type IconName = "google" | "github";

export function createIcon(iconName: IconName) {
  switch (iconName) {
    case "google":
      return <AiOutlineGoogle size="1.5rem"/>;
    case "github":
      return <AiFillGithub size="1.5rem"   />;
    default:
      return null;
  }
}