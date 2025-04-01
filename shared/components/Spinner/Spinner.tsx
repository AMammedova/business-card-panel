import React from "react";

const Spinner = () => {
  return (
    <div className="flex  items-center justify-center pt-24">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
};

export default Spinner;
