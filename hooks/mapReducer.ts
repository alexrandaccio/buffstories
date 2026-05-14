import { DraftPin, Pin } from "@/types/pin";

export type State =
  | { mode: "none" }
  | { mode: "create"; draftPin: DraftPin }
  | { mode: "view"; selectedPin: Pin };

export type Action =
  | { type: "OPEN_CREATE"; payload: { lat: number; lng: number } }
  | { type: "OPEN_VIEW"; payload: Pin }
  | { type: "CLOSE" }
  | { type: "UPDATE_DRAFT"; payload: { title?: string; description?: string } }
  | { type: "SAVE_SUCCESS" };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN_CREATE":
      return {
        mode: "create",
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
        selectedPin: action.payload,
      };

    case "CLOSE":
      return {
        mode: "none",
      };

    case "UPDATE_DRAFT":
      if (state.mode !== "create") return state;

      return {
        mode: "create",
        draftPin: {
          ...state.draftPin,
          ...action.payload,
        },
      };

    case "SAVE_SUCCESS":
      return {
        mode: "none",
      };

    default:
      return state;
  }
}
