import {Annex, Contract} from "../contract.model";
import {
  DocumentsActions,
  FETCH_CONTRACTS,
  GENERATE_CONTRACTS,
  GENERATE_DELIVERY,
  GENERATE_REGISTER,
  QUEUE_GENERATING_TASK_AND_START_POLLING,
  RESET_NOTIFICATION_COUNTER,
  SET_ANNEX,
  SET_CONTRACTS,
  SET_TASK_PROGRESS,
  STOP_POLLING,
  UPDATE_ANNEX
} from "./documents.action";
import {QueuedTaskInfo} from "../notifications/notifications.component";
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";

const INITIAL_TASK_PROGRESS = 0;
export const FINISHED_TASK_PROGRESS = 100;
export const POLLING_INTERVAL = 10000;

export interface QueuedTaskInfoState extends EntityState<QueuedTaskInfo> {
}

export const queuedTaskInfoEntityAdapter: EntityAdapter<QueuedTaskInfo> = createEntityAdapter<QueuedTaskInfo>({
  sortComparer: (n1: QueuedTaskInfo, n2: QueuedTaskInfo) => n1.progress - n2.progress
});

export interface State {
  contracts: Contract[];
  generatedDocuments: string[];
  queuedTasks: QueuedTaskInfoState;
  notificationCounter: number;
  isGenerating: boolean;
}

const initialState = {
  contracts: [],
  generatedDocuments: [],
  queuedTasks: queuedTaskInfoEntityAdapter.getInitialState(),
  notificationCounter: 0,
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
        if (foundContract) {
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
    case GENERATE_DELIVERY:
      return {
        ...state,
        isGenerating: true
      }
    case QUEUE_GENERATING_TASK_AND_START_POLLING:
      return {
        ...state,
        queuedTasks: queuedTaskInfoEntityAdapter.addOne({
            ...action.payload,
            progress: INITIAL_TASK_PROGRESS
        }, state.queuedTasks),
        notificationCounter: state.notificationCounter + 1
      };
    case SET_TASK_PROGRESS:
      let currentTask = getQueueEntities(state)[action.payload.id];
      if (currentTask && currentTask.progress !== action.payload.progress) {
        return {
          ...state,
          generatedDocuments: [...action.payload.documents],
          queuedTasks: queuedTaskInfoEntityAdapter.updateOne({
            id: currentTask.id,
            changes: {progress: action.payload.progress}
          }, state.queuedTasks)
        }
      }
      return state;
    case RESET_NOTIFICATION_COUNTER:
      return {
        ...state,
        notificationCounter: 0
      }
    case STOP_POLLING:
      return {
        ...state,
        notificationCounter: state.notificationCounter + 1,
        isGenerating: false
      }
    default:
      return state;
  }
}

export const getQueueEntities = (state: State) => state.queuedTasks.entities;
