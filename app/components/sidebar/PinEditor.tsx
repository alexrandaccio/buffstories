"use client";

import { DraftPin } from "@/types/pin";

type Props = {
  mode: "create" | "edit";
  draftPin: DraftPin;
  onChange: (patch: { title?: string; description?: string }) => void;
  onSave: () => void;
};

export default function PinEditor({ mode, draftPin, onChange, onSave }: Props) {
  return (
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
          className="w-full border rounded px-3 py-2 min-h-[120px]"
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
  );
}
