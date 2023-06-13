import {School} from "../schools/school.model";
import {Week} from "../programs/program.model";

export class Annex {
  constructor(public id: number,
              public no: number,
              public contract_id: number,
              public validity_date: string,
              public fruitVeg_products: number,
              public dairy_products: number,
              public sign_date: string,
              public validity_date_end: string | null,
) {

  }
}

export class Contract{

  constructor(public id: number,
              public contract_no: string,
              public contract_year: string,
              public fruitVeg_products: number,
              public dairy_products: number,
              public program_id: number,
              public validity_date: string,
              public school: School,
              public annex: Annex[]) {
  }
}


export class Application {
  constructor(public id: number,
              public no: number,
              public type: string,
              public program_id: number,
              public contracts: Contract[],
              public weeks: Week[]) {

  }
}
