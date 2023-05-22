import Head from "next/head";
import type { GetServerSidePropsContext } from "next";
import { getSession, signOut } from "next-auth/react";
import { type Session } from "next-auth";

import { Button } from "@/components";
import { wss } from "../server/wssServer";

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
      <section className="flex h-screen flex-col items-center  justify-center pt-[3.75rem] text-white md:min-h-screen  ">
        <h1>Home Page</h1>
        <div>
          {JSON.stringify(userSession.user.username, null, 2)}
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
        </div>
      </section>
    </>
  );
};

export default Home;
