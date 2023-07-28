import {
  FETCH_INVOICE,
  FETCH_INVOICE_PRODUCTS,
  FETCH_SUPPLIERS,
  InvoiceAction,
  SET_INVOICE_PRODUCTS,
  SET_INVOICES,
  SET_SUPPLIERS
} from "./invoice.action";
import {Invoice, InvoiceProduct, Supplier} from "../invoice.model";

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
    default:
      return state;
  }
}
