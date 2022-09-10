import {Contract} from "../contract.model";
import {
  DocumentsActions,
  FETCH_CONTRACTS,
  GENERATE_CONTRACTS,
  GENERATE_REGISTER,
  SET_CONTRACTS
} from "./documents.action";
import {convert_date_from_backend_format} from "../../shared/date_converter.utils";

export interface State {
  contracts: Contract[];
  generatedDocuments: string[];
  isGenerating: boolean;
}

const initialState = {
  contracts: [],
  generatedDocuments: [],
  isGenerating: false
}

export function documentsReducer(state: State = initialState, action: DocumentsActions)
{
  switch(action.type) {
    case FETCH_CONTRACTS:
      return {
        ...state,
        contracts: [...state.contracts]
      }
    case SET_CONTRACTS:
      return {
        ...state,
        contracts: [...action.payload.contracts],
        generatedDocuments: [...action.payload.documents],
        isGenerating: false
      }
    case GENERATE_CONTRACTS:
    case GENERATE_REGISTER:
      return {
        ...state,
        isGenerating: true
      }
    default:
      return state;
  }
}


