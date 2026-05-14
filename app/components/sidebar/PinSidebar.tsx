"use client";

import PinCreateForm from "./PinCreateForm";
import PinViewPanel from "./PinViewPanel";

type DraftPin = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
};

type Pin = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string | null;
};

type Props = {
  mode: "none" | "create" | "view";

  draftPin: DraftPin | null;
  selectedPin: Pin | null;

  setMode: (mode: "none" | "create" | "view") => void;
  setDraftPin: (pin: DraftPin | null) => void;
  setSelectedPin: (pin: Pin | null) => void;

  onSave: () => void;
};

export default function PinSidebar({
  mode,
  draftPin,
  selectedPin,
  setMode,
  setDraftPin,
  setSelectedPin,
  onSave,
}: Props) {
  if (mode === "none") return null;

  return (
    <div className="absolute top-0 right-0 h-full w-[400px] bg-white shadow-2xl border-l z-10 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">
          {draftPin ? "Create Pin" : "View Pin"}
        </h2>

        <button
          onClick={() => {
            setMode("none");
            setDraftPin(null);
            setSelectedPin(null);
          }}
          className="text-sm text-gray-500 hover:text-black"
        >
          Close
        </button>
      </div>

      {mode === "create" && draftPin && (
        <PinCreateForm
          draftPin={draftPin}
          setDraftPin={setDraftPin}
          onSave={onSave}
        />
      )}

      {mode === "view" && selectedPin && <PinViewPanel pin={selectedPin} />}
    </div>
  );
}
