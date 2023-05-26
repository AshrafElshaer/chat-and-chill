import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";

import { type AppType } from "next/app";
import { type Session } from "next-auth";

import { SessionProvider } from "next-auth/react";
import { api } from "@/utils/api";

import { Layout } from "@/components";

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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <ReactQueryDevtools />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
