import {
  convert_date_from_backend_format,
  convert_date_to_backend_format,
  get_next_date,
  is_working_day,
  validate_date
} from "./date_converter.utils";
import {Product, Week} from "../programs/program.model";
import {DAIRY_PRODUCT} from "./namemapping.utils";

export const MAXIMUM_RESOLVER_TIMES = 5;
export const SZT = "SZT";


export function get_current_program() {
  const jsonProgram = localStorage.getItem("currentProgram");
  if (!jsonProgram) {
    throw new Error("CurrentProgram not found in localStorage");
  }
  return JSON.parse(jsonProgram);
}

export function get_weeks() {
  const jsonProgram = localStorage.getItem("currentWeeks");
  if (!jsonProgram) {
    throw new Error("CurrentWeeks not found in localStorage");
  }
  return JSON.parse(jsonProgram);
}

export function generate_dates(week: Week): string[] {
  let generated_dates: string[] = [];
  let next_date = convert_date_from_backend_format(week.start_date);
  let end_date = convert_date_from_backend_format(week.end_date);
  while (validate_date(next_date, end_date)) {
    if (is_working_day(next_date)) {
      generated_dates.push(convert_date_to_backend_format(next_date, "."));
    }
    next_date = get_next_date(next_date);
  }
  return generated_dates;
}

export function get_str_weight_type(_product: Product)
{
    if (_product.weight_type === "L" || _product.product_type === DAIRY_PRODUCT) {
      return SZT;
    }
    return _product.weight_type;
}
