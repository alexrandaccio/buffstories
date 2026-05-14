"use client";

import { Pin } from "@/types/pin";

type Props = {
  pin: Pin;
};

export default function PinViewPanel({ pin }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-black">{pin.title}</h3>

      <div className="text-black whitespace-pre-wrap">
        {pin.description || (
          <span className="text-gray-400">No description</span>
        )}
      </div>

      <div className="text-sm text-gray-500">
        <div>Lat: {pin.latitude.toFixed(5)}</div>
        <div>Lng: {pin.longitude.toFixed(5)}</div>
      </div>
    </div>
  );
}
