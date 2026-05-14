import { DraftPin, Pin } from "@/types/pin";

export type State = {
  mode: "none" | "create" | "view";
  draftPin: DraftPin | null;
  selectedPin: Pin | null;
};

export type Action =
  | { type: "OPEN_CREATE"; payload: { lat: number; lng: number } }
  | { type: "OPEN_VIEW"; payload: Pin }
  | { type: "CLOSE" }
  | { type: "UPDATE_DRAFT"; payload: Partial<DraftPin> }
  | { type: "SAVE_SUCCESS" };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN_CREATE":
      return {
        mode: "create",
        selectedPin: null,
        draftPin: {
          latitude: action.payload.lat,
          longitude: action.payload.lng,
          title: "",
          description: "",
        },
      };

    case "OPEN_VIEW":
      return {
        mode: "view",
        draftPin: null,
        selectedPin: action.payload,
      };

    case "CLOSE":
      return {
        mode: "none",
        draftPin: null,
        selectedPin: null,
      };

    case "UPDATE_DRAFT":
      return {
        ...state,
        draftPin: state.draftPin
          ? { ...state.draftPin, ...action.payload }
          : null,
      };

    case "SAVE_SUCCESS":
      return {
        mode: "none",
        draftPin: null,
        selectedPin: null,
      };

    default:
      return state;
  }
}
