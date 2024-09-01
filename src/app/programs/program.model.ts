export interface ProgramResponse {
  programs: Program[];
}

export interface WeeksResponse {
  week: Week[];
}

export class Program {
  constructor(public id: number,
              public semester_no: number,
              public school_year: string,
              public company_id: number,
              public start_date: string | null,
              public end_date: string | null,
              public fruitVeg_price: number | null,
              public dairy_price: number | null,
              public fruitVeg_min_per_week: number | null,
              public dairy_min_per_week: number | null,
              public dairy_amount: number | null,
              public fruitVeg_amount: number | null
  ) {
  }
}

export class Week {
  constructor(public id: number,
              public week_no: number,
              public start_date: string,
              public end_date: string,
              public program_id: number | null = null) {
  }
}

export class Product {
  constructor(public name: string,
              public weight_type: string,
              public product_type: string,
              public vat: number) {
  }
}

export class ProductStore {
  constructor(public product: Product,
              public weight: number,
              public min_amount: number,
              public program_id: number,
              public id: number) {
  }
}
