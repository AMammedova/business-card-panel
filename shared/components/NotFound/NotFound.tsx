// shared/components/NotFound.tsx
import React from "react";

interface NotFoundProps {
  message?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ message }) => {
  return (
    <div className="text-center p-6">
      <h3 className="text-xl font-semibold mb-2">Not Found</h3>
      <p className="text-gray-500">{message || "No data found."}</p>
    </div>
  );
};

export default NotFound;
