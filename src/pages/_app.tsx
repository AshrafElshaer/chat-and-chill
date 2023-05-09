import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "@/utils/api";
import "@/styles/globals.css";

import { Layout } from "@/components";
import { useRouter } from "next/router";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const { pathname } = router;
  const showSidebar = pathname !== "/auth/login" && pathname !== "/auth/signup";
  return (
    <SessionProvider session={session}>
      {showSidebar ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
