"use client";

import { DraftPin } from "@/types/pin";

type Props = {
  draftPin: DraftPin;
  setDraftPin: (pin: DraftPin) => void;
  onSave: () => void;
};

export default function PinCreateForm({
  draftPin,
  setDraftPin,
  onSave,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-black">
          Title
        </label>

        <input
          value={draftPin.title}
          onChange={(e) =>
            setDraftPin({
              ...draftPin,
              title: e.target.value,
            })
          }
          className="w-full border rounded-lg px-3 py-2 text-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-black">
          Description
        </label>

        <textarea
          value={draftPin.description}
          onChange={(e) =>
            setDraftPin({
              ...draftPin,
              description: e.target.value,
            })
          }
          className="w-full border rounded-lg px-3 py-2 min-h-[150px] text-black"
        />
      </div>

      <div className="text-sm text-gray-500">
        <div>Lat: {draftPin.latitude.toFixed(5)}</div>
        <div>Lng: {draftPin.longitude.toFixed(5)}</div>
      </div>

      <button
        onClick={onSave}
        className="w-full bg-black text-white rounded-lg py-3"
      >
        Save Pin
      </button>
    </div>
  );
}
