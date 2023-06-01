import Head from "next/head";
import { getSession, signOut } from "next-auth/react";

import type { GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";

import { Avatar, Button, Input } from "@/components";
import { ChangeEvent, FormEvent, useState } from "react";
import { userValidationSchema } from "./auth/signup";
import { toast } from "react-toastify";
import { api } from "@/utils/api";
import { uploadImage } from "@/utils/supabase";

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

  const userSession = session;

  return {
    props: { userSession },
  };
};

type Props = {
  userSession: Session;
};

const Home = ({ userSession }: Props) => {
  const [userInfo, setUserInfo] = useState(userSession.user);
  const [isInfoChanged, setIsInfoChanged] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const updateUserInfoMutation = api.user.updateUserInfo.useMutation();

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (!isInfoChanged) setIsInfoChanged(true);

    return setUserInfo((curr) => ({
      ...curr,
      [name]: value,
    }));
  }

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const image = e.target.files[0] as File;

    if (!isInfoChanged) setIsInfoChanged(true);

    setImageFile(image);
    setUserInfo((curr) => ({
      ...curr,
      image: URL.createObjectURL(image),
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const resualt = imageFile && (await uploadImage(imageFile, userInfo.id));

    const inputValidation = userValidationSchema.safeParse(userInfo);

    if (!inputValidation.success)
      return toast.error(inputValidation.error.message);

    const updateUserInfo = await updateUserInfoMutation.mutateAsync({
      username: inputValidation.data.username,
      bio: inputValidation.data.bio || "",
      image: resualt || userSession.user.image,
      name: inputValidation.data.name,
    });

    if (!updateUserInfo.sucsses)
      return toast.error("Ops! Something went wrong");

    return toast.success("Profile updated successfully");
  }
  return (
    <>
      <Head>
        <title>Chat & Chill</title>
        <meta name="description" content="Chat , Video & Voice call" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex h-screen flex-col items-center  justify-center pt-[3.75rem] text-white md:min-h-screen  ">
        <Avatar src={userInfo.image} isOnline={false} width={120} />

        <form
          className="my-8 flex flex-col gap-4"
          onSubmit={(e) => void handleSubmit(e)}
        >
          <Input
            type="file"
            name="image"
            id="file-input"
            accept="image/*"
            className="block w-60 cursor-pointer rounded-md px-0 py-0 text-sm shadow-sm file:mr-4 file:border-0 file:bg-gray-600 file:bg-transparent file:px-2 file:py-3 file:text-gray-400 focus:z-10"
            label="Profile Image"
            onChange={handleFileUpload}
          />

          <Input
            name="name"
            type="text"
            value={userInfo.name || ""}
            className="w-60 rounded-md"
            label="Name"
            onChange={handleInputChange}
          />
          <Input
            name="bio"
            type="text"
            value={userInfo.bio}
            className="w-60 rounded-md"
            label="Bio"
            onChange={handleInputChange}
          />
          <Input
            name="email"
            type="text"
            defaultValue={userInfo.email}
            className="w-60 rounded-md"
            label="Email"
            disabled
          />
          <Input
            name="username"
            type="text"
            defaultValue={userInfo.username}
            className="w-60 rounded-md"
            label="Username"
            disabled
          />
          <Button type="submit" disabled={!isInfoChanged}>
            Save
          </Button>
        </form>
      </section>
    </>
  );
};

export default Home;
