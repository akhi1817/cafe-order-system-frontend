import React from "react";

const MenuShimmer = () => {
  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Category Tabs shimmer */}
      <div className="flex gap-2 overflow-x-auto">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-24 h-8 bg-gray-200 animate-pulse rounded-full"
          ></div>
        ))}
      </div>

      {/* Product list shimmer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="border rounded-lg p-3 shadow-sm flex gap-3 animate-pulse"
          >
            {/* Image */}
            <div className="w-20 h-20 bg-gray-200 rounded-md"></div>

            {/* Text */}
            <div className="grow flex flex-col gap-2">
              <div className="w-32 h-4 bg-gray-200 rounded"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuShimmer;
