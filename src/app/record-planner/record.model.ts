export class ProductDemand {
  constructor(public isRequired: boolean,
             public name: string = "") {
  }
}

export class FruitVegProductDemand extends ProductDemand{
}

export class DairyProductDemand extends ProductDemand {
}

export class SchoolWithRecordDemand {
  constructor(public nick: string,
              public fruitVeg: FruitVegProductDemand,
              public dairy: DairyProductDemand) {
  }
}

export interface RecordsDemand {
  date: string;
  recordsDemand: SchoolWithRecordDemand[];
}

export class Record {
  constructor(public id: number,
              public no: string,
              public date: string,
              public delivery_date: string | null,
              public delivered_kids_no: number | null,
              public state: string,
              public product_store_id: number,
              public product_type: string,
              public contract_id: number,
              public week_id: number) {
  }
}

export enum RecordStates {
  PLANNED = "PLANNED",
  GENERATED = "GENERATED",
  DELIVERED = "DELIVERED",
  DELIVERY_PLANNED = "DELIVERY_PLANNED",
  ASSIGN_NUMBER = "ASSIGN_NUMBER"
}

export function get_state_number(state: string): number {
  if (state == RecordStates.DELIVERED) {
    return 3;
  }
  if (state == RecordStates.PLANNED) {
    return 1;
  }
  return 0;
}


export enum RecordAdditionResultInfo {
  SUCCESS = 0,
  RECORD_OF_THIS_TYPE_EXISTS,
  MIN_AMOUNT_EXCEED,
  NO_CONTRACT_FOR_PRODUCT_TYPE,
  FAILED_WITH_OTHER_REASON
}

export interface RecordAddResult {
  nick: string;
  product: string;
  result: RecordAdditionResultInfo;
  record: Record | null;
}

export interface RecordUpdateResult {
  record: Record;
}

export interface AdditionRecordsResponse {
  date: string;
  records: RecordAddResult[];
}

