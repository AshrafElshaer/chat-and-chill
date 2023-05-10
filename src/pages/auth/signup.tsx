import Image from "next/image";
import { getSession } from "next-auth/react";
import { type GetServerSidePropsContext } from "next";
import type { User, Session } from "next-auth";
import { api } from "@/utils/api";
import { uploadImage } from "@/utils/supabase";
import { z } from "zod";

import { Button, Input } from "@/components";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useRouter } from "next/router";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  if (session && session.user.username) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userSession = session;

  return {
    props: { userSession },
  };
};

type Props = {
  userSession: Session;
};

export default function Signup({ userSession }: Props) {
  const [userInfo, setUserInfo] = useState<User>({
    ...userSession.user,
    username: suggestUsername(userSession.user.name || ""),
  });

  const validateUsernameMutation = api.user.validateUsername.useMutation();
  const updateUserInfoMutation = api.user.updateUserInfo.useMutation();

  const [isChangeAvatar, setIsChangeAvatar] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

  const router = useRouter();

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "name")
      return setUserInfo({
        ...userInfo,
        username: suggestUsername(value),
        [name]: value,
      });

    if (name === "username" && !isUsernameAvailable)
      setIsUsernameAvailable(true);

    return setUserInfo({
      ...userInfo,
      [name]: value,
    });
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const image = e.target.files[0] as File;

    const resualt = await uploadImage(image, userInfo.id);
    return setUserInfo({
      ...userInfo,
      image: resualt,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const inputValidation = userValidationSchema.safeParse(userInfo);

    console.log(userInfo);
    if (!inputValidation.success) return console.log(inputValidation.error);

    const usernameValidation = await validateUsernameMutation.mutateAsync({
      username: inputValidation.data.username,
    });

    if (!usernameValidation.isAvailable) return setIsUsernameAvailable(false);

    const updateUserInfo = await updateUserInfoMutation.mutateAsync({
      username: inputValidation.data.username,
      bio: inputValidation.data.bio || "",
      image: inputValidation.data.image,
    });

    if (!updateUserInfo.sucsses) return alert(updateUserInfo);

    return router.push("/");
  }

  return (
    <section className="container  flex min-h-screen items-center  justify-center text-darkGrey">
      <div className="w-96 ">
        <Image
          src={userInfo.image}
          alt="Profile Image"
          width={100}
          height={100}
          className="mx-auto mb-8 rounded-full"
        />
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="flex flex-col justify-center gap-4"
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

          <Input
            id="name"
            label="Name"
            type="text"
            value={userInfo.name || ""}
            name="name"
            onChange={handleInputChange}
            className="w-72"
          />

          <Input
            id="bio"
            label="Bio"
            type="text"
            value={userInfo.bio || ""}
            name="bio"
            onChange={handleInputChange}
            className="w-72"
          />

          <Input
            id="email"
            label="Email"
            type="text"
            name="email"
            value={userInfo.email}
            disabled={true}
            className="w-72 cursor-not-allowed"
          />

          <Input
            id="username"
            label="Username"
            type="text"
            name="username"
            value={userInfo.username || ""}
            onChange={handleInputChange}
            className={`w-72 ${
              isUsernameAvailable ? "" : "border border-red-500"
            }`}
          />
          {isUsernameAvailable ? null : (
            <span className="text-red-500">Username is not available.</span>
          )}
          <Button type="submit" disabled={!isUsernameAvailable}>
            Save
          </Button>
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

const userValidationSchema = z.object({
  bio: z.string().optional().nullable(),
  email: z.string().email(),
  id: z.number(),
  image: z.string().url(),
  name: z.string(),
  username: z.string().min(3).max(20),
});
