import React from "react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

type Props = {
  session: Session;
};

const UserMenu = ({ session }: Props) => {
  return (
    <ul
      className="absolute right-8 top-16 w-48 border border-lightGray/20 rounded-md bg-lightBg
    py-2 text-white shadow-xl"
      aria-labelledby="user-menu-button"
    >
      <li className="  gap px-4 py-2 text-sm ">
        <h4>{session.user.name}</h4>
        <p className=" break-words ">{session.user.email}</p>
      </li>
      <li className="hover:bg-lightGray/30">
        <a href="#" className="block px-4 py-2 text-sm  ">
          Settings
        </a>
      </li>
      <li className="hover:bg-lightGray/30">
        <button
          className="block px-4 py-2 text-sm "
          onClick={() =>
            void signOut({
              callbackUrl: "/auth/login",
              redirect: true,
            })
          }
        >
          Sign Out
        </button>
      </li>
    </ul>
  );
};

export default UserMenu;
