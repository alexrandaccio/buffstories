"use client";

import { DraftPin } from "@/types/pin";

type Props = {
  mode: "create" | "edit";
  draftPin: DraftPin;
  onChange: (patch: { title?: string; description?: string }) => void;
  onSave: () => void;
  onClose: () => void;
};

export default function PinEditor({
  mode,
  draftPin,
  onChange,
  onSave,
  onClose,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">
          {mode === "create" ? "Create Pin" : "Edit Pin"}
        </h2>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 cursor-pointer hover:text-black"
        >
          Close
        </button>
      </div>
      <div className="space-y-4 text-black">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>

          <input
            className="w-full border rounded px-3 py-2"
            value={draftPin.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>

          <textarea
            className="w-full border rounded px-3 py-2 min-h-30"
            value={draftPin.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </div>

        <button
          onClick={onSave}
          className="w-full bg-black text-white rounded py-2 cursor-pointer hover:opacity-90"
        >
          {mode === "create" ? "Create Pin" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
