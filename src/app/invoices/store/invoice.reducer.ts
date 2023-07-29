import {
  ADD_SUPPLIER,
  FETCH_INVOICE,
  FETCH_INVOICE_PRODUCTS,
  FETCH_SUPPLIERS,
  InvoiceAction, SAVE_SUPPLIER,
  SET_INVOICE_PRODUCTS,
  SET_INVOICES,
  SET_SUPPLIERS, UPDATE_SUPPLIER
} from "./invoice.action";
import {Invoice, InvoiceProduct, Supplier} from "../invoice.model";
import {ADD, SAVE, UPDATE} from "../../schools/store/schools.action";
import {School} from "../../schools/school.model";

export interface State {
  suppliers: Supplier[];
  invoices: Invoice[];
  invoicesProduct: InvoiceProduct[];
}
export const initialState = {
  suppliers: [],
  invoices: [],
  invoicesProduct: []
}


export function invoiceReducer(state: State = initialState, action: InvoiceAction) {
  switch(action.type) {
    case FETCH_INVOICE:
      return {
        ...state,
        invoices: []
      }
    case  FETCH_SUPPLIERS:
      return {
        ...state,
        suppliers: []
      }
    case  FETCH_INVOICE_PRODUCTS:
      return {
        ...state,
        invoicesProduct: []
      }
    case SET_INVOICES:
      return {
        ...state,
        invoices: [...action.invoice]
      }
    case SET_SUPPLIERS:
      return {
        ...state,
        suppliers: [...action.supplier]
      }
    case SET_INVOICE_PRODUCTS:
      return {
        ...state,
        invoicesProduct: [...action.invoice_products]
      }
    case ADD_SUPPLIER:
      return {
        ...state,
        suppliers: [...state.suppliers, action.payload],
    }
    case UPDATE_SUPPLIER:
    case SAVE_SUPPLIER:
      const found_supplier: Supplier | any = state.suppliers.find((_res: Supplier, index) => {
        return _res.nick === action.payload.nick;
      });
      const updated_suppliers = [...state.suppliers];
      if (found_supplier) {
        const updated_supplier = {
          ...found_supplier,
          ...action.payload
        }
        const indexOfUpdate = state.suppliers.indexOf(found_supplier);
        updated_suppliers[indexOfUpdate] = updated_supplier;
      }
      return {
        ...state,
        suppliers: updated_suppliers
      }
    default:
      return state;
  }
}
