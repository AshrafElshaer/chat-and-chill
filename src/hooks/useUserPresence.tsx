import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { supabase } from "../utils/supabase";
import { useSession } from "next-auth/react";
import type { RealtimePresenceState } from "@supabase/supabase-js";
import { boolean } from "zod";

const UserPresenceContext = createContext({
  onlineUsers: [] as number[],
  isUserOnline: (userId: number): boolean => false,
});

export function useUserPresence() {
  const context = useContext(UserPresenceContext);
  if (!context) {
    throw new Error("useSidebars must be used within a SidebarsProvider");
  }
  return context;
}

export const UserPresenceProvider = ({ children }: { children: ReactNode }) => {
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const userPresenceChannal = supabase
      .channel("presence:users-channel")
      .on("presence", { event: "sync" }, () => {
        const state = userPresenceChannal.presenceState();
        setOnlineUsers(getOnlineUsers(state));
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        const state = userPresenceChannal.presenceState();
        setOnlineUsers(getOnlineUsers(state));
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        const state = userPresenceChannal.presenceState();
        setOnlineUsers(getOnlineUsers(state));
      })
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .subscribe(async (status): Promise<void> => {
        if (status === "SUBSCRIBED") {
          await userPresenceChannal.track({
            userId: session?.user.id,
          });
        }
      });
    return () => {
      supabase
        .removeChannel(userPresenceChannal)
        .then(() => {
          console.log("Channel removed.");
        })
        .catch((error) => {
          console.log("Error removing channel: ", error);
        });
    };
  }, [session]);

  function isUserOnline(userId: number) {
    return onlineUsers.find((user) => user === userId) ? true : false;
  }

  return (
    <UserPresenceContext.Provider value={{ onlineUsers, isUserOnline }}>
      {children}
    </UserPresenceContext.Provider>
  );
};

// const useUserPresence = () => {
//   const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
//   const { data: session } = useSession();

//   useEffect(() => {
//     const userPresenceChannal = supabase
//       .channel("presence:users-channel")
//       .on("presence", { event: "sync" }, () => {
//         console.log("sync");
//         const state = userPresenceChannal.presenceState();
//         setOnlineUsers(getOnlineUsers(state));
//       })
//       .on("presence", { event: "join" }, ({ newPresences }) => {
//         console.log("joined", newPresences);
//         const state = userPresenceChannal.presenceState();
//         setOnlineUsers(getOnlineUsers(state));
//       })
//       .on("presence", { event: "leave" }, ({ leftPresences }) => {
//         console.log("left", leftPresences);
//         const state = userPresenceChannal.presenceState();
//         setOnlineUsers(getOnlineUsers(state));
//       })
//       // eslint-disable-next-line @typescript-eslint/no-misused-promises
//       .subscribe(async (status): Promise<void> => {
//         if (status === "SUBSCRIBED") {
//           await userPresenceChannal.track({
//             userId: session?.user.id,
//           });
//         }
//       });
//     return () => {
//       supabase
//         .removeChannel(userPresenceChannal)
//         .then(() => {
//           console.log("Channel removed.");
//         })
//         .catch((error) => {
//           console.log("Error removing channel: ", error);
//         });
//     };
//   }, [session]);

//   useEffect(() => {
//     console.log("onlineUsers", onlineUsers);
//   }, [onlineUsers]);

//   function isUserOnline(userId: number) {
//     return onlineUsers.find((user) => user === userId) ? true : false;
//   }

//   return { isUserOnline };
// };

// export default useUserPresence;

function getOnlineUsers(presenceState: RealtimePresenceState) {
  const users = Object.keys(presenceState)
    .map((presenceId) => {
      const presences = presenceState[presenceId] as unknown as {
        userId: number;
      }[];
      return presences.map((presence) => presence.userId);
    })
    .flat();

  return users;
}
