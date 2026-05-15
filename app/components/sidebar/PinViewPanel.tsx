"use client";

import { Pin } from "@/types/pin";

type Props = {
  pin: Pin;
  openEdit: () => void;
  onDelete: () => void;
};

export default function PinViewPanel({ pin, openEdit, onDelete }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-black">{pin.title}</h3>
      </div>

      <div className="text-black whitespace-pre-wrap leading-relaxed">
        {pin.description || (
          <span className="text-gray-400">No description</span>
        )}
      </div>

      <div className="text-sm text-gray-500 space-y-1">
        <div>Lat: {pin.latitude.toFixed(5)}</div>
        <div>Lng: {pin.longitude.toFixed(5)}</div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={openEdit}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 transition"
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
