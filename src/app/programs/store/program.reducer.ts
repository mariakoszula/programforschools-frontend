import {
  ADD,
  ERROR_HANDLER,
  FETCH,
  ProgramActions,
  SAVE,
  SAVE_PRODUCT,
  SAVE_WEEK,
  SELECT,
  SET_ALL,
  SET_ALL_DAIRY_PRODUCTS,
  SET_ALL_FRUIT_VEG_PRODUCTS,
  SET_PRODUCT_TYPE,
  SET_PRODUCTS,
  SET_WEEK_ALL, SetAll,
  UPDATE
} from "./program.action";
import {Product, ProductStore, Program, Week} from "../program.model";
import {DAIRY_PRODUCT, FRUIT_PRODUCT, FRUIT_VEG_PRODUCT, VEGETABLE_PRODUCT} from "../../shared/namemapping.utils";

export interface State {
  programs: Program[];
  indexOfSelectedProgram: number;
  isLoading: boolean;
  weeks: Week[];
  availableProduct: Product[],
  dairyProducts: ProductStore[];
  fruitVegProducts: ProductStore[];
  product_type: string[];
  error: string;
}

export const clearState: State = {
      programs: [],
      indexOfSelectedProgram: -1,
      isLoading: false,
      weeks: [],
      product_type: [],
      availableProduct: [],
      error: "",
      dairyProducts: [],
      fruitVegProducts: []
    };
const initialState: State = prepareInitialState();
function prepareInitialState() {
  const programDataJson = localStorage.getItem("currentProgram");
  if (!programDataJson) {
    return clearState;
  }
  const weeksDataJson = localStorage.getItem("currentWeeks");
  const diaryProductsDataJson = localStorage.getItem("currentDiaryProducts");
  const fruitVegProductsDataJson = localStorage.getItem("currentFruitVegProducts");

  return {
    programs: [JSON.parse(programDataJson)],
    indexOfSelectedProgram: 0,
    isLoading: false,
    weeks: weeksDataJson ? JSON.parse(weeksDataJson) : [],
    product_type: [],
    availableProduct: [],
    error: "",
    dairyProducts: diaryProductsDataJson ? JSON.parse(diaryProductsDataJson) : [],
    fruitVegProducts: fruitVegProductsDataJson ? JSON.parse(fruitVegProductsDataJson) : []
  };

}

function updated_product(product_store: ProductStore[], product: ProductStore) {
  const found_product: ProductStore | undefined = product_store.find((_product, index) => {
    return _product.id === product.id && _product.program_id === product.program_id;
  });
  if (found_product) {
    const index = product_store.indexOf(found_product);
    product_store[index] = {...found_product, ...product};
    return true;
  }
  return false;
}

function is_fruit_veg_product(type: string) {
  return type === FRUIT_PRODUCT || type === VEGETABLE_PRODUCT || type === FRUIT_VEG_PRODUCT;
}

export function programReducer(state = initialState, action: ProgramActions) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        programs: [...state.programs, action.payload],
        indexOfSelectedProgram: -1,
        isLoading: true
      };
    case SAVE_WEEK:
      const weeks_updated = [...state.weeks];
      const week = state.weeks.find((_week, index) => {
        return _week.week_no === action.payload.week_no && _week.program_id === action.payload.program_id;
      });
      if (week) {
        const week_updated = {
          ...week,
          ...action.payload
        }
        const indexOfUpdate = state.weeks.indexOf(week);
        weeks_updated[indexOfUpdate] = week_updated;
      } else {
        weeks_updated.push(action.payload);
      }
      return {
        ...state,
        weeks: weeks_updated,
        error: ""
      };
    case SAVE_PRODUCT:
      let updatedProducts: ProductStore[] = [];
      if (is_fruit_veg_product(action.product_type)) {
        updatedProducts = [...state.fruitVegProducts];
        if (!updated_product(updatedProducts, action.payload)) {
          updatedProducts.push(action.payload);
        }
      } else if (action.product_type === DAIRY_PRODUCT) {
        updatedProducts = [...state.dairyProducts];
        if (!updated_product(updatedProducts, action.payload)) {
          updatedProducts.push(action.payload);
        }
      }
      return {
        ...state,
        dairyProducts: action.product_type === DAIRY_PRODUCT ? updatedProducts : [...state.dairyProducts],
        fruitVegProducts: is_fruit_veg_product(action.product_type) ? updatedProducts : [...state.fruitVegProducts]
      };
    case UPDATE:
    case SAVE:
      const program = state.programs.find((program, index) => {
        return program.semester_no === action.payload.semester_no && program.school_year === action.payload.school_year;
      });
      const updated_programs = [...state.programs];
      if (program) {
        const updated_program = {
          ...program,
          ...action.payload
        }
        const indexOfUpdate = state.programs.indexOf(program);
        updated_programs[indexOfUpdate] = updated_program;
      }
      return {
        ...state,
        programs: updated_programs,
        isLoading: false
      };
    case FETCH:
      return {
        programs: [],
        indexOfSelectedProgram: -1,
        isLoading: false,
        weeks: [],
        product_type: [],
        availableProduct: [],
        error: "",
        dairyProducts: [],
        fruitVegProducts: []
      };
    case SET_ALL:
      return {
        ...state,
        programs: [...action.payload],
      };
    case SET_WEEK_ALL:
      return {
        ...state,
        weeks: [...action.payload],
        error: ""
      };
    case SET_ALL_FRUIT_VEG_PRODUCTS:
      return {
        ...state,
        error: "",
        fruitVegProducts: [...action.payload]
      };
    case SET_ALL_DAIRY_PRODUCTS:
      return {
        ...state,
        dairyProducts: [...action.payload],
        error: ""
      };
    case SET_PRODUCT_TYPE:
      return {
        ...state,
        product_type: [...action.payload]
      };
    case SELECT:
      return {
        ...state,
        programs: [...state.programs],
        indexOfSelectedProgram: action.payload,
        isLoading: false,
        error: ""
      };
    case SET_PRODUCTS:
      return {
        ...state,
        availableProduct: [...action.payload]
      };
    case ERROR_HANDLER:
      return {
        ...state,
        error: action.payload
      }
    default:
      return state;
  }
}
