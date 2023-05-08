import Image from "next/image";
import { getSession, useSession } from "next-auth/react";
import { type GetServerSidePropsContext } from "next";
import { Button, Input } from "@/components";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { uploadImage } from "@/utils/supabase";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/auth/login",
  //       permanent: false,
  //     },
  //   };
  // }
  // if (session && session.user.username) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { session },
  };
};
export default function Signup() {
  // const { data: session } = useSession();
  const session = {
    user: {
      name: "Ashraf Elshaer",
      email: "ashrafelshaer98@gmail.com",
      image:
        "https://lh3.googleusercontent.com/a/AGNmyxY4eMnn942EjbWwaoBBGN-yEsG1CjtsALTTkqC1=s96-c",
      username: "",
      id: "2",
    },
    expires: "2023-06-06T05:56:56.599Z",
  };
  const [isChangeAvatar, setIsChangeAvatar] = useState(false);
  const [userInfo, setUserInfo] = useState({
    ...session.user,
    username: suggestUsername(session.user.name),
  });
  // if (!session) return null;

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "name") {
      return setUserInfo({
        ...userInfo,
        username: suggestUsername(value),
        [name]: value,
      });
    }
    return setUserInfo({
      ...userInfo,
      [name]: value,
    });
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const image = e.target.files[0] as File;

    const resualt = await uploadImage(image, userInfo.id);
    setUserInfo({
      ...userInfo,
      image: resualt,
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    console.log(userInfo);
  }

  return (
    <section className="container  flex min-h-screen items-center  justify-center text-darkGrey">
      <div className="w-72 ">
        <Image
          src="https://nrsstdptogyfvsluloir.supabase.co/storage/v1/object/public/images/images/user-icon.png"
          alt="Profile Image"
          width={100}
          height={100}
          className="mx-auto mb-8 rounded-full"
        />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-2"
        >
          {isChangeAvatar ? (
            <Input
              type="file"
              name="image"
              id="file-input"
              onChange={(e) => void handleFileUpload(e)}
              accept="image/*"
              className="block w-full cursor-pointer px-0 py-0 text-sm shadow-sm file:mr-4 file:border-0 file:bg-gray-600 file:bg-transparent file:px-2 file:py-3 file:text-gray-400 focus:z-10"
            />
          ) : (
            <Button onClick={() => setIsChangeAvatar(true)}>
              Upload Profile Image !
            </Button>
          )}

          <label htmlFor="name" className="pl-2">
            Full Name
          </label>
          <Input
            type="text"
            value={userInfo.name}
            name="name"
            onChange={handleInputChange}
          />
          <label htmlFor="email" className="pl-2">
            Email
          </label>
          <Input
            type="text"
            name="email"
            value={userInfo.email}
            disabled={true}
            className="cursor-not-allowed"
          />
          <label htmlFor="username" className="pl-2">
            Username
          </label>
          <Input
            type="text"
            name="username"
            value={userInfo.username || ""}
            onChange={handleInputChange}
          />
          {/* <div>
  <div className="flex rounded-md shadow-sm">
    <span className="px-4 inline-flex items-center min-w-fit rounded-l-md border border-r-0 border-gray-200 bg-gray-50  text-gray-500 dark:bg-gray-700 dark:border-gray-700 dark:text-white">@</span>
    <input type="text" className="py-2 px-3 pr-11 block w-full border-gray-200 shadow-sm rounded-r-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"/>
  </div> */}
          {/* </div> */}
          <Button type="submit">Save</Button>
        </form>
      </div>
    </section>
  );
}

function suggestUsername(value: string): string {
  const fullName: string[] = value.split(" ");
  const [firstName, lastName] = fullName;
  if (!firstName) return "";
  return [firstName[0], lastName].join("").toLowerCase();
}
