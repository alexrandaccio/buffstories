"use client";

import PinCreateForm from "./PinCreateForm";
import PinViewPanel from "./PinViewPanel";
import { Action, State } from "@/hooks/mapReducer";

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
  onSave: () => void;
};

export default function PinSidebar({ state, dispatch, onSave }: Props) {
  const { mode, draftPin, selectedPin } = state;

  if (mode === "none") return null;

  return (
    <div className="absolute top-0 right-0 h-full w-[400px] bg-white shadow-2xl border-l z-10 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">
          {draftPin ? "Create Pin" : "View Pin"}
        </h2>

        <button
          onClick={() => dispatch({ type: "CLOSE" })}
          className="text-sm text-gray-500 hover:text-black"
        >
          Close
        </button>
      </div>

      {/* CREATE MODE */}
      {mode === "create" && draftPin && (
        <PinCreateForm
          draftPin={draftPin}
          setDraftPin={(updated) =>
            dispatch({
              type: "UPDATE_DRAFT",
              payload: updated,
            })
          }
          onSave={onSave}
        />
      )}

      {/* VIEW MODE */}
      {mode === "view" && selectedPin && <PinViewPanel pin={selectedPin} />}
    </div>
  );
}
