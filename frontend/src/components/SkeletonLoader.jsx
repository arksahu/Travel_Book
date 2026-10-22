import React from 'react';

export const TripCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-subtle animate-pulse">
    <div className="h-44 bg-stone-200"></div>
    <div className="p-5 space-y-3">
      <div className="h-5 bg-stone-200 rounded-md w-3/4"></div>
      <div className="h-4 bg-stone-200 rounded-md w-1/2"></div>
      <div className="pt-2 flex justify-between items-center">
        <div className="h-4 bg-stone-200 rounded-md w-1/4"></div>
        <div className="h-8 bg-stone-200 rounded-xl w-24"></div>
      </div>
    </div>
  </div>
);

export const ItineraryDaySkeleton = () => (
  <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-subtle space-y-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-6 bg-stone-200 rounded-md w-1/3"></div>
      <div className="h-6 bg-stone-200 rounded-full w-20"></div>
    </div>
    <div className="h-4 bg-stone-200 rounded-md w-2/3"></div>
    <div className="space-y-3 pt-2">
      <div className="h-20 bg-stone-100 rounded-xl"></div>
      <div className="h-20 bg-stone-100 rounded-xl"></div>
      <div className="h-20 bg-stone-100 rounded-xl"></div>
    </div>
  </div>
);
