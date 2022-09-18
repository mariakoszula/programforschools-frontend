import {Annex, Contract} from "../contract.model";
import {
  DocumentsActions,
  FETCH_CONTRACTS,
  GENERATE_CONTRACTS,
  GENERATE_REGISTER,
  SET_ANNEX,
  SET_CONTRACTS,
  UPDATE_ANNEX
} from "./documents.action";

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

export function documentsReducer(state: State = initialState, action: DocumentsActions) {
  switch (action.type) {
    case FETCH_CONTRACTS:
      return {
        ...state,
        contracts: [],
        generatedDocuments: [],
        isGenerating: false
      }
    case SET_CONTRACTS:
      let updated_contracts: Contract[] = [...state.contracts];
      action.payload.contracts.forEach(new_contract => {
        const foundContract = updated_contracts.find(_contract => _contract.id === new_contract.id);
        if (foundContract){
          const indexOfUpdatedContract = updated_contracts.indexOf(foundContract);
          updated_contracts[indexOfUpdatedContract] = {...new_contract};
        } else {
          updated_contracts.push(new_contract)
        }
      });
      return {
        ...state,
        contracts: updated_contracts,
        generatedDocuments: [...action.payload.documents],
        isGenerating: false
      }
    case SET_ANNEX:
      const updated_contracts_for_annex = [...state.contracts];
      const contract_with_annex = state.contracts.find((_contract: Contract) => {
        return _contract.id === action.payload.annex.contract_id;
      });
      if (contract_with_annex) {
        const indexOfUpdatedContract = state.contracts.indexOf(contract_with_annex);
        let updated_contract = {...contract_with_annex};
        updated_contract.annex = [...contract_with_annex.annex]
        const annex = contract_with_annex.annex.find((_annex: Annex) => {
          return _annex.id === action.payload.annex.id;
        });
        if (annex) {
          const index = updated_contract.annex.indexOf(annex);
          if (index > -1) {
            updated_contract.annex.splice(index, 1);
          }
        }
        updated_contract.annex.push(action.payload.annex);
        updated_contracts_for_annex[indexOfUpdatedContract] = updated_contract;
      }
      return {
        ...state,
        contracts: updated_contracts_for_annex,
        generatedDocuments: [...action.payload.documents],
        isGenerating: false
      }
    case UPDATE_ANNEX:
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


