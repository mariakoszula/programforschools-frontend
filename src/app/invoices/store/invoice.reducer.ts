import {
  ADD_INVOICE,
  ADD_INVOICE_PRODUCT,
  ADD_SUPPLIER,
  FETCH_INVOICE,
  FETCH_INVOICE_PRODUCTS,
  FETCH_SUPPLIERS,
  InvoiceAction,
  SAVE_INVOICE,
  SAVE_INVOICE_PRODUCTS,
  SAVE_SUPPLIER,
  SET_INVOICE_PRODUCTS,
  SET_INVOICES,
  SET_SUPPLIERS,
  UPDATE_INVOICE,
  UPDATE_INVOICE_PRODUCT,
  UPDATE_SUPPLIER
} from "./invoice.action";
import {Invoice, InvoiceProduct, Supplier} from "../invoice.model";

export interface State {
  suppliers: Supplier[];
  invoices: Invoice[];
  invoicesProduct: InvoiceProduct[];
  error: string;
}

export const initialState = {
  suppliers: [],
  invoices: [],
  invoicesProduct: [],
  error: ""
}


export function invoiceReducer(state: State = initialState, action: InvoiceAction) {
  switch (action.type) {
    case FETCH_INVOICE:
      return {
        ...state,
        invoices: [],
        error: ""
      }
    case  FETCH_SUPPLIERS:
      return {
        ...state,
        suppliers: [],
        error: ""
      }
    case  FETCH_INVOICE_PRODUCTS:
      return {
        ...state,
        invoicesProduct: [],
        error: ""
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
    case SAVE_SUPPLIER: {
      const found_supplier: Supplier | any = state.suppliers.find((_res: Supplier, index) => {
        return _res.id === action.payload.id;
      });
      if (!found_supplier) {
        return {
          ...state,
          suppliers: [...state.suppliers, action.payload],
          error: ""
        }
      }
      const updated_suppliers = [...state.suppliers];
      const updated_supplier = {
        ...found_supplier,
        ...action.payload
      }
      const indexOfUpdate = state.suppliers.indexOf(found_supplier);
      updated_suppliers[indexOfUpdate] = updated_supplier;

      return {
        ...state,
        suppliers: updated_suppliers
      }
    }
    case SAVE_INVOICE: {
      let found_invoice: Invoice | any = state.invoices.find((_res: Invoice, index) => {
        return _res.id === action.payload.id;
      });
      if (!found_invoice) {
        return {
          ...state,
          invoices: [...state.invoices, action.payload],
          error: ""
        }
      }
      const updated_invoices = [...state.invoices];
      const updated_invoice = {
        ...found_invoice,
        ...action.payload
      }
      const indexOfUpdate = state.invoices.indexOf(found_invoice);
      updated_invoices[indexOfUpdate] = updated_invoice;
      return {
        ...state,
        invoices: updated_invoices
      }
    }
    case UPDATE_SUPPLIER:
    case UPDATE_INVOICE:
    case UPDATE_INVOICE_PRODUCT:
    case ADD_INVOICE_PRODUCT:
    case ADD_INVOICE:
    case ADD_SUPPLIER:
      return {
        ...state
      }
    case SAVE_INVOICE_PRODUCTS:
      if (action.payload === null) {
        return {...state, error: action.error}
      }
      let found_invoice_product: InvoiceProduct | any = state.invoicesProduct.find((_res: InvoiceProduct) => {
        return _res.id === action.payload!.id;
      });
      if (!found_invoice_product) {
        return {
          ...state,
          invoicesProduct: [...state.invoicesProduct, action.payload],
          error: ""
        }
      }
      const updated_invoice_products = [...state.invoicesProduct];
      const updated_invoice_product = {
        ...found_invoice_product,
        ...action.payload
      }
      const indexOfUpdate = state.invoicesProduct.indexOf(found_invoice_product);
      updated_invoice_products[indexOfUpdate] = updated_invoice_product;
      return {
        ...state,
        invoicesProduct: updated_invoice_products,
        error: ""
      }
    default:
      return state;
  }
}
