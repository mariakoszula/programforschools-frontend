import {Action} from "@ngrx/store";
import {Invoice, InvoiceDisposal, InvoiceProduct, Supplier} from "../invoice.model";
import {GENERATE_CONTRACTS, QUEUE_GENERATING_TASK_AND_START_POLLING} from "../../documents/store/documents.action";

export const FETCH_INVOICE = "[INVOICE] FETCH_INVOICE";
export const ADD_INVOICE = "[INVOICE] ADD_INVOICE";
export const UPDATE_INVOICE = "[INVOICE] UPDATE_INVOICE";
export const SET_INVOICES = "[INVOICE] SET_INVOICES";
export const SAVE_INVOICE = "[INVOICE] SAVE_INVOICE";

export const FETCH_SUPPLIERS = "[INVOICE] FETCH_SUPPLIERS";
export const ADD_SUPPLIER = "[INVOICE] ADD_SUPPLIER";
export const UPDATE_SUPPLIER = "[INVOICE] UPDATE_SUPPLIER";
export const SET_SUPPLIERS = "[INVOICE] SET_SUPPLIERS";
export const SAVE_SUPPLIER = "[INVOICE] SAVE_SUPPLIER";


export const FETCH_INVOICE_PRODUCTS = "[INVOICE] FETCH_INVOICE_PRODUCTS";
export const ADD_INVOICE_PRODUCT = "[INVOICE] ADD_INVOICE_PRODUCT";
export const UPDATE_INVOICE_PRODUCT = "[INVOICE] UPDATE_INVOICE_PRODUCT";
export const SET_INVOICE_PRODUCTS = "[INVOICE] SET_INVOICE_PRODUCTS";
export const SAVE_INVOICE_PRODUCTS = "[INVOICE] SAVE_INVOICE_PRODUCTS";

export const FETCH_INVOICE_DISPOSALS = "[INVOICE] FETCH_INVOICE_DISPOSALS";
export const ADD_INVOICE_DISPOSALS = "[INVOICE] ADD_INVOICE_DISPOSALS";
export const UPDATE_INVOICE_DISPOSALS = "[INVOICE] UPDATE_INVOICE_DISPOSALS";
export const SET_INVOICE_DISPOSALS = "[INVOICE] SET_INVOICE_DISPOSALS";
export const SAVE_INVOICE_DISPOSALS = "[INVOICE] SAVE_INVOICE_DISPOSALS";

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

  constructor(public payload: Invoice) {
  }
}

export class UpdateInvoice implements Action {
  readonly type = UPDATE_INVOICE;

  constructor(public payload: Invoice, public invoice_id: number) {
  }
}


export class SaveInvoice implements Action {
  readonly type = SAVE_INVOICE;

  constructor(public payload: Invoice) {
  }
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
  constructor(public payload: InvoiceProduct) {
  }
}

export class UpdateInvoiceProduct implements Action {
  readonly type = UPDATE_INVOICE_PRODUCT;

  constructor(public payload: InvoiceProduct, public invoice_product_id: number) {
  }
}


export class SaveInvoiceProduct implements Action {
  readonly type = SAVE_INVOICE_PRODUCTS;

  constructor(public payload: InvoiceProduct | null, public error: string) {
  }
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

  constructor(public payload: Supplier) {
  }
}

export class UpdateSupplier implements Action {
  readonly type = UPDATE_SUPPLIER;

  constructor(public payload: Supplier, public supplier_id: number) {
  }
}

export class SaveSupplier implements Action {
  readonly type = SAVE_SUPPLIER;

  constructor(public payload: Supplier) {
  }
}


export class FetchInvoiceDisposal implements Action {
  readonly type = FETCH_INVOICE_DISPOSALS;
}

export class SetInvoiceDisposal implements Action {
  readonly type = SET_INVOICE_DISPOSALS;

  constructor(public invoice_disposals: InvoiceDisposal[]) {
  }
}

export class AddInvoiceDisposal implements Action {
  readonly type = ADD_INVOICE_DISPOSALS;
  constructor(public payload: InvoiceDisposal) {
  }
}

export class UpdateInvoiceDisposal implements Action {
  readonly type = UPDATE_INVOICE_DISPOSALS;

  constructor(public payload: InvoiceDisposal, public invoice_disposal_id: number) {
  }
}


export class SaveInvoiceDisposal implements Action {
  readonly type = SAVE_INVOICE_DISPOSALS;

  constructor(public payload: InvoiceDisposal | null, public error: string) {
  }
}

export type InvoiceAction = FetchInvoice |
  AddInvoice | UpdateInvoice | FetchSupplier | AddSupplier | UpdateSupplier |
  SetSuppliers | SetInvoices | FetchInvoiceProducts | AddInvoiceProduct | UpdateInvoiceProduct | SetInvoiceProducts |
  SaveSupplier | SaveInvoice | SaveInvoiceProduct |
  FetchInvoiceDisposal | AddInvoiceDisposal | UpdateInvoiceDisposal | SetInvoiceDisposal | SaveInvoiceDisposal;
