import React from "react";

type Props = {
  setIsVoiceCall: React.Dispatch<React.SetStateAction<boolean>>;
};

const VoiceCall = ({ setIsVoiceCall }: Props) => {
  return (
    <div className="h-screen grid place-content-center" onClick={() => setIsVoiceCall(false)}>
      VoiceCall
    </div>
  );
};

export default VoiceCall;
