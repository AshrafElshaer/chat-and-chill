import type {
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";

const config: ClientConfig = {
  mode: "rtc",
  codec: "vp8",
};

export const useAgoraClient = createClient(config);

export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();


