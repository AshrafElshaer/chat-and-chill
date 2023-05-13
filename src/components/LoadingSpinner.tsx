import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen flex-col rounded-xl  ">
      <div className="flex flex-auto flex-col items-center justify-center p-4 md:p-5">
        <div className="flex justify-center">
          <div
            className="inline-block h-10 w-10 animate-spin rounded-full border-[3px] border-current border-t-transparent text-primary"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
