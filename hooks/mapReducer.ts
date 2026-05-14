import { DraftPin, Pin } from "@/types/pin";

export type State =
  | { mode: "none" }
  | { mode: "create"; draftPin: DraftPin }
  | { mode: "edit"; draftPin: DraftPin; pinId: string }
  | { mode: "view"; selectedPin: Pin };

export type Action =
  | { type: "OPEN_CREATE"; payload: { lat: number; lng: number } }
  | { type: "OPEN_VIEW"; payload: Pin }
  | { type: "OPEN_EDIT" }
  | { type: "CLOSE" }
  | { type: "UPDATE_DRAFT"; payload: { title?: string; description?: string } }
  | { type: "CREATE_SUCCESS" }
  | { type: "APPLY_PIN_UPDATE"; payload: Pin };

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

    case "OPEN_EDIT":
      if (state.mode !== "view") return state;

      return {
        mode: "edit",
        pinId: state.selectedPin.id,
        draftPin: {
          latitude: state.selectedPin.latitude,
          longitude: state.selectedPin.longitude,
          title: state.selectedPin.title,
          description: state.selectedPin.description ?? "",
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
      if (state.mode !== "create" && state.mode !== "edit") return state;

      return {
        ...state,
        draftPin: {
          ...state.draftPin,
          ...action.payload,
        },
      };

    case "CREATE_SUCCESS":
      return {
        mode: "none",
      };

    default:
      return state;
  }
}
