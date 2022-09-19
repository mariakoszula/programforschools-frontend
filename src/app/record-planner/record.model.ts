export class Record {
  constructor(public isRequired: boolean,
             public name: string = "") {
  }
}

export class FruitVegRecord extends Record{
}

export class DairyRecord extends Record {
}

export class RecordRequiredForSchool {
  constructor(public nick: string,
              public fruitVeg: FruitVegRecord,
              public dairy: DairyRecord) {
  }
}
