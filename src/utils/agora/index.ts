import type { ClientConfig } from "agora-rtc-sdk-ng";
import { createClient ,createMicrophoneAndCameraTracks } from "agora-rtc-react";

const config: ClientConfig = {
  mode: "rtc",
  codec: "vp8",
};

export const useAgoraClient = createClient(config);

export const useMicrophoneAndVideoTracks = createMicrophoneAndCameraTracks();
