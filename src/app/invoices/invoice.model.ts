export class Supplier {
  constructor(public id: number,
              public name: string,
              public nick: string) {
  }
}

export class InvoiceProduct {
  constructor(public id: number,
              public invoice_id: number,
              public product_store_id: number,
              public amount: number) {
  }
}

export class Invoice {
  constructor(public  id: number,
              public name: string,
              public date: string,
              public supplier_id: number,
              public program_id: number) {
  }
}
