export class Supplier {
  constructor(public id: number,
              public name: string,
              public nick: string) {
  }
}


export class Invoice {
  constructor(public id: number,
              public name: string,
              public date: string,
              public supplier_id: number,
              public program_id: number) {
  }
}

export class InvoiceProduct {
  constructor(public id: number,
              public invoice_id: number,
              public product_store_id: number,
              public amount: number) {
  }
}

export class InvoiceDisposal {
  constructor(public id: number,
              public invoice_product_id: number,
              public application_id: number,
              public amount: number) {
  }
}
export interface ProductWithDisposal {
  product: InvoiceProduct,
  disposals: InvoiceDisposal[]
}

export interface InvoiceWithProducts {
  invoice: Invoice,
  products: ProductWithDisposal[]
}

