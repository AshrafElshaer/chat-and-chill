import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
// import Link from "next/link";
import { getSession, signOut } from "next-auth/react";

// import { api } from "@/utils/api";
import { Button } from "@/components";
import { type Session } from "next-auth";

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

  

  
  return (
    <>
      <Head>
        <title>Chat & Chill</title>
        <meta name="description" content="Chat , Video & Voice call" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center text-white container ">
        <h1>Home Page</h1>
        {JSON.stringify(userSession, null, 2)}
        <Button
          onClick={() =>
            void signOut({
              callbackUrl: "/auth/login",
              redirect: true,
            })
          }
        >
          sign out
        </Button>
      </main>
    </>
  );
};

export default Home;
