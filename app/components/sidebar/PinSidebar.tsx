"use client";

import PinEditor from "./PinEditor";
import PinViewPanel from "./PinViewPanel";
import { Action, State } from "@/hooks/mapReducer";

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
  onSave: () => void;
  onDelete: () => void;
  onNext: () => void;
  onPrev: () => void;
  user: any;
};

export default function PinSidebar({
  state,
  dispatch,
  onSave,
  onDelete,
  onNext,
  onPrev,
  user,
}: Props) {
  if (state.mode === "none") return null;

  return (
    <div className="absolute top-0 right-0 h-full w-full max-w-100 bg-white shadow-2xl border-l z-10 p-6 overflow-y-auto">
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
          onClose={() => dispatch({ type: "CLOSE" })}
        />
      )}

      {/* VIEW MODE */}
      {state.mode === "view" && state.selectedPin && (
        <PinViewPanel
          pin={state.selectedPin}
          openEdit={() => dispatch({ type: "OPEN_EDIT" })}
          onDelete={onDelete}
          onNext={onNext}
          onPrev={onPrev}
          onClose={() => dispatch({ type: "CLOSE" })}
          user={user}
        />
      )}
    </div>
  );
}
