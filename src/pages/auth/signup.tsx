import Image from "next/image";
import { getSession, useSession } from "next-auth/react";
import { type GetServerSidePropsContext } from "next";
import { Button, Input } from "@/components";
import { type ChangeEvent, type FormEvent, useState } from "react";

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
      username: null,
      id: "2",
    },
    expires: "2023-06-06T05:56:56.599Z",
  };
  const [userInfo, setUserInfo] = useState(session.user);
  // if (!session) return null;

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    console.log(name, value);
    setUserInfo({ ...userInfo, [name]: value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(userInfo);
  }

  return (
    <section className="container  flex min-h-screen items-center  justify-center text-darkGrey">
      <div className="w-72 ">
        <Image
          src={userInfo.image}
          alt="Profile Image"
          width={100}
          height={100}
          className="mx-auto mb-8 rounded-full"
        />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-4"
        >
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

          <Button type="submit">Save</Button>
        </form>
      </div>
    </section>
  );
}

// { "user": { "name": "Ashraf Elshaer", "email": "ashrafelshaer98@gmail.com", "image": "https://lh3.googleusercontent.com/a/AGNmyxY4eMnn942EjbWwaoBBGN-yEsG1CjtsALTTkqC1=s96-c", "username": null, "id": 2 }, "expires": "2023-06-06T05:56:56.599Z" }
