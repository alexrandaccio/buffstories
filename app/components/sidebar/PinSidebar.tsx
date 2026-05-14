"use client";

import PinEditor from "./PinEditor";
import PinViewPanel from "./PinViewPanel";
import { Action, State } from "@/hooks/mapReducer";

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
  onSave: () => void;
};

export default function PinSidebar({ state, dispatch, onSave }: Props) {
  if (state.mode === "none") return null;

  return (
    <div className="absolute top-0 right-0 h-full w-[400px] bg-white shadow-2xl border-l z-10 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">
          {state.mode === "create" ? "Create Pin" : "View Pin"}
        </h2>

        <button
          onClick={() => dispatch({ type: "CLOSE" })}
          className="text-sm text-gray-500 hover:text-black"
        >
          Close
        </button>
      </div>

      {/* CREATE / EDIT MODES */}
      {(state.mode === "create" || state.mode === "edit") && (
        <PinEditor
          mode={state.mode}
          draftPin={state.draftPin}
          onChange={(patch) =>
            dispatch({
              type: "UPDATE_DRAFT",
              payload: patch,
            })
          }
          onSave={onSave}
        />
      )}

      {/* VIEW MODE */}
      {state.mode === "view" && state.selectedPin && (
        <PinViewPanel
          pin={state.selectedPin}
          openEdit={() => dispatch({ type: "OPEN_EDIT" })}
        />
      )}
    </div>
  );
}
