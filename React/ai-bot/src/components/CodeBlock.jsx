import React from "react";
import toast from "react-hot-toast";

const CodeBlock = ({ code }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success("✅ Code copied!");
  };

  return (
    <div className="relative bg-gray-900 text-green-300 font-mono p-3 rounded-lg my-2 overflow-x-auto text-sm shadow-md">
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 text-xs rounded"
      >
        📋 Copy
      </button>
      <pre className="whitespace-pre-wrap">{code}</pre>
    </div>
  );
};

export default CodeBlock; 