import {Action} from "@ngrx/store";
import {Product, ProductStore, Program, Week} from "../program.model";

export const ADD = "[Program] ADD";
export const UPDATE = "[Program] UPDATE";
export const FETCH = "[Program] FETCH";
export const SELECT = "[Program] SELECT";
export const SET_ALL = "[Program] SET_ALL";
export const SET_WEEK_ALL = "[Program] SET_WEEK_ALL";
export const SET_ALL_DAIRY_PRODUCTS = "[Program] SET_ALL_DAIRY_PRODUCTS";
export const SET_ALL_FRUIT_VEG_PRODUCTS = "[Program] SET_ALL_FRUIT_VEG_PRODUCTS";
export const SAVE = "[Program] SAVE";
export const ADD_WEEK = "[Week] ADD_WEEK";
export const EDIT_WEEK = "[Week] EDIT_WEEK";
export const SAVE_WEEK = "[Week] SAVE_WEEK";
export const DELETE_WEEK = "[Week] DELETE_WEEK";
export const ERROR_HANDLER = "[Program] ERROR_HANDLER";
export const FETCH_PRODUCT_TYPE = "[Product] FETCH_PRODUCT_TYPE"
export const SET_PRODUCT_TYPE = "[Product] SET_PRODUCT_TYPE"
export const FETCH_PRODUCT = "[Product] FETCH_PRODUCT"
export const SET_PRODUCTS = "[Product] SET_PRODUCTS"
export const ADD_PRODUCT = "[Product] ADD_PRODUCT"
export const EDIT_PRODUCT = "[Product] EDIT_PRODUCT"
export const SAVE_PRODUCT = "[Product] SAVE_PRODUCT"

export class Fetch implements Action {
  readonly type = FETCH;
}

export class Add implements Action {
  readonly type = ADD;

  constructor(public payload: Program) {
  }
}

export class Update implements Action {
  readonly type = UPDATE;

  constructor(public payload: Program) {
  }
}

export class Save implements Action {
  readonly type = SAVE;

  constructor(public payload: Program) {
  }
}

export class SetAll implements Action {
  readonly type = SET_ALL;

  constructor(public payload: Program[]) {
  }
}

export class Select implements Action {
  readonly type = SELECT;

  constructor(public payload: number) {
  }
}

export class AddWeek implements Action {
  readonly type = ADD_WEEK;

  constructor(public payload: Week) {
  }
}

export class EditWeek implements Action {
  readonly type = EDIT_WEEK;

  constructor(public payload: Week) {
  }
}

export class SaveWeek implements Action {
  readonly type = SAVE_WEEK;

  constructor(public payload: Week) {
  }
}

export class DeleteWeek implements Action {
  readonly type = DELETE_WEEK;

  constructor(public payload: number) {
  }
}

export class SetAllWeek implements Action {
  readonly type = SET_WEEK_ALL;

  constructor(public payload: Week[]) {
  }
}

export class ErrorHandler implements Action {
  readonly type = ERROR_HANDLER;

  constructor(public payload: string) {

  }
}

export class SetAllDairyProducts implements Action {
  readonly type = SET_ALL_DAIRY_PRODUCTS;

  constructor(public payload: ProductStore[]) {
  }
}

export class SetAllFruitVegProducts implements Action {
  readonly type = SET_ALL_FRUIT_VEG_PRODUCTS;

  constructor(public payload: ProductStore[]) {
  }
}

export class FetchProductType implements Action {
  readonly type = FETCH_PRODUCT_TYPE;
}

export class SetProductType implements Action {
  readonly type = SET_PRODUCT_TYPE;

  constructor(public payload: string[]) {
  }
}

export class FetchProduct implements Action {
  readonly type = FETCH_PRODUCT;

  constructor(public product_type: string) {
  }
}

export class SetProducts implements Action {
  readonly type = SET_PRODUCTS;

  constructor(public payload: Product[]) {
  }
}

export class AddProduct implements Action {
  readonly type = ADD_PRODUCT;

  constructor(public product_type: string, public payload: ProductStore) {
  }
}

export class EditProduct implements Action {
  readonly type = EDIT_PRODUCT;

  constructor(public payload: ProductStore) {
  }
}

export class SaveProduct implements Action {
  readonly type = SAVE_PRODUCT;

  constructor(public product_type: string, public payload: ProductStore) {
  }
}

export type ProgramActions =
  Fetch
  | Add
  | Update
  | SetAll
  | Select
  | Save
  | AddWeek
  | EditWeek
  | SaveWeek
  | DeleteWeek
  | SetAllWeek
  | ErrorHandler
  | SetAllDairyProducts
  | SetAllFruitVegProducts
  | FetchProductType
  | SetProductType
  | FetchProduct
  | SetProducts
  | SaveProduct
  | AddProduct
  | EditProduct
