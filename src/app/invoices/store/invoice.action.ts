import {Action} from "@ngrx/store";
import {Invoice, InvoiceProduct, Supplier} from "../invoice.model";


export const FETCH_INVOICE = "[INVOICE] FETCH_INVOICE";
export const ADD_INVOICE = "[INVOICE] ADD_INVOICE";
export const UPDATE_INVOICE = "[INVOICE] UPDATE_INVOICE";
export const SET_INVOICES = "[INVOICE] SET_INVOICES";


export const FETCH_SUPPLIERS = "[INVOICE] FETCH_SUPPLIERS";
export const ADD_SUPPLIER = "[INVOICE] ADD_SUPPLIER";
export const UPDATE_SUPPLIER = "[INVOICE] UPDATE_SUPPLIER";
export const SET_SUPPLIERS = "[INVOICE] SET_SUPPLIERS";


export const FETCH_INVOICE_PRODUCTS = "[INVOICE] FETCH_INVOICE_PRODUCTS";
export const ADD_INVOICE_PRODUCT = "[INVOICE] ADD_INVOICE_PRODUCT";
export const UPDATE_INVOICE_PRODUCT = "[INVOICE] UPDATE_INVOICE_PRODUCT";
export const SET_INVOICE_PRODUCTS = "[INVOICE] SET_INVOICE_PRODUCTS";

export class FetchInvoice implements Action {
  readonly type = FETCH_INVOICE;
}

export class SetInvoices implements Action {
  readonly type = SET_INVOICES;
  constructor(public invoice: Invoice[]) {
  }
}


export class AddInvoice implements Action {
  readonly type = ADD_INVOICE;
}

export class UpdateInvoice implements Action {
  readonly type = UPDATE_INVOICE;
}

export class FetchInvoiceProducts implements Action {
  readonly type = FETCH_INVOICE_PRODUCTS;
}

export class SetInvoiceProducts implements Action {
  readonly type = SET_INVOICE_PRODUCTS;

  constructor(public invoice_products: InvoiceProduct[]) {
  }
}

export class AddInvoiceProduct implements Action {
  readonly type = ADD_INVOICE_PRODUCT;
}

export class UpdateInvoiceProduct implements Action {
  readonly type = UPDATE_INVOICE_PRODUCT;
}

export class FetchSupplier implements Action {
  readonly type = FETCH_SUPPLIERS;
}

export class SetSuppliers implements Action {
  readonly type = SET_SUPPLIERS;

  constructor(public supplier: Supplier[]) {
  }
}

export class AddSupplier implements Action {
  readonly type = ADD_SUPPLIER;
}

export class UpdateSupplier implements Action {
  readonly type = UPDATE_SUPPLIER;
}

export type InvoiceAction = FetchInvoice |
  AddInvoice | UpdateInvoice | FetchSupplier | AddSupplier | UpdateSupplier |
  SetSuppliers | SetInvoices | FetchInvoiceProducts | AddInvoiceProduct | UpdateInvoiceProduct | SetInvoiceProducts;
