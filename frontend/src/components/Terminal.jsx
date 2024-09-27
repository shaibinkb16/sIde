import React from 'react';

const OutputWindow = ({ outputDetails }) => {
  const getOutput = () => {
    if (outputDetails?.error) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {outputDetails.error}
        </pre>
      );
    } else if (outputDetails?.result) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-green-500">
          {outputDetails.result}
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-gray-500">
          No output available
        </pre>
      );
    }
  };

  return (
    <>
      <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2 justify-start flex w-full">
        Output
      </h1>
      <div className="w-full h-56 min-h-[150px] sm:h-64 lg:h-72 xl:h-80 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto">
        {getOutput()}
      </div>
    </>
  );
};

export default OutputWindow;
