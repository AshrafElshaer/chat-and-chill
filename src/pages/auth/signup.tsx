import { getSession, useSession } from "next-auth/react";
import { type GetServerSidePropsContext } from "next";
import { copyFileSync } from "fs";

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
  //   if (session && session.user) {
  //     return {
  //       redirect: {
  //         destination: "/",
  //         permanent: false,
  //       },
  //     };
  //   }

  return {
    props: { session },
  };
};
export default function Signup() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div
      className="text-2xl text-white
      "
    >
      {/* <input type="text" value={session.user.name as string} className="text-black"/> */}
      <div className="text-white">{JSON.stringify(session, null, 2)}</div>
    </div>
  );
}
