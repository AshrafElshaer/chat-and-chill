import { use, useCallback, useEffect, useState } from "react";
import { useAgoraClient, useMicrophoneAndVideoTracks } from "@/utils/agora";
import { env } from "@/env.mjs";
import { type IAgoraRTCRemoteUser, AgoraVideoPlayer } from "agora-rtc-react";
import type { User } from "next-auth";

type Props = {
  setIsVoiceCall: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: number;
  user: User;
};

const VoiceCall = ({ setIsVoiceCall, roomId, user }: Props) => {
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState<boolean>(false);
  const agoraClient = useAgoraClient();
  const { ready, tracks } = useMicrophoneAndVideoTracks();

  const handleUserPublished = useCallback(
    async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
      console.log("user published");
      await agoraClient.subscribe(user, mediaType);

      setUsers((prevUsers) => {
        return [...prevUsers, user];
      });
      // user.videoTrack?.play();
      // user.audioTrack?.play();
    },
    [agoraClient]
  );

  const handleUserUnpublished = useCallback(
    (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
      console.log("user unpublished");
      if (mediaType === "audio") {
        user.audioTrack?.stop();
      }
      if (mediaType === "video") {
        user.videoTrack?.stop();
      }
      setUsers((prevUsers) => {
        return prevUsers.filter((User) => User.uid !== user.uid);
      });
    },
    []
  );

  const handleUserLeft = useCallback((user: IAgoraRTCRemoteUser) => {
    console.log("user left");
    user.audioTrack?.stop();
    user.videoTrack?.stop();
    setUsers((prevUsers) => {
      return prevUsers.filter((User) => User.uid !== user.uid);
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    agoraClient.on("user-published", handleUserPublished);

    agoraClient.on("user-unpublished", handleUserUnpublished);

    agoraClient.on("user-left", handleUserLeft);

    const init = async (roomId: string, userId: string) => {
      console.log("user init");
      await agoraClient
        .join(
          env.NEXT_PUBLIC_AGORA_APP_ID,
          roomId,
          env.NEXT_PUBLIC_AGORA_TEMP_TOKEN,
          userId
        )
        .then((uid) => {
          // get the audio and video tracks from tracks

          const microphoneTrack = tracks && tracks[0];
          const cameraTrack = tracks && tracks[1];

          setUsers((prevUsers) => {
            return [
              ...prevUsers,
              {
                uid,
                audioTrack: microphoneTrack ? microphoneTrack : undefined,
                videoTrack: cameraTrack ? cameraTrack : undefined,
                hasAudio: microphoneTrack ? true : false,
                hasVideo: cameraTrack ? true : false,
              },
            ];
          });
        });
    };

    init(roomId.toString(), user.id.toString())
      .then(async () => {
        if (tracks) await agoraClient.publish(tracks);
        setStart(true);
      })
      .catch((err) => {
        console.log("init error", err);
      });

    return () => {
      console.log("unmount");
      if (tracks) {
        for (const track of tracks) {
          track.stop();
        }
      }
      agoraClient.off("user-published", handleUserPublished);
      agoraClient.off("user-unpublished", handleUserUnpublished);
      agoraClient.off("user-left", handleUserLeft);
      agoraClient.leave().catch((err) => {
        console.error("leave error", err);
      });
    };
  }, [ready, tracks]);

  useEffect(() => {
    console.log({ users });
  }, [users]);

  return (
    <div
      className="grid h-screen place-content-center"
      onClick={() => setIsVoiceCall(false)}
    >
      VoiceCall
      {start && (
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full text-green-500"></div>
          <span>start</span>
        </div>
      )}
      {users.map(
        (user) =>
          user.videoTrack && (
            <AgoraVideoPlayer
              key={user.uid}
              className="h-48 w-48"
              videoTrack={user.videoTrack}
            />
          )
      )}
    </div>
  );
};

export default VoiceCall;
