import {formatDate} from "@angular/common";

export function validate_date(start_date: string, end_date: string) {
  return new Date(start_date) <= new Date(end_date);
}

export function convert_date_to_backend_format(date: string, separator="-") {
  const [year, month, day] = date.split(separator);
  return `${day}.${month}.${year}`;
}

export function convert_date_from_backend_format(date: string, join_separator=".",  separator=".") {
   //TODO use regex in future to properly convert dates depending on format
  //backend: dd.MM.YYYY frontend date: YYYY-mm-dd frontEnd display: YYYY.mm.dd
  const [day, month, year] = date.split(separator);
  return `${year}.${month}.${day}`;
}

export function validate_date_range(start_date: string, end_date: string) {
  if (start_date && end_date && !validate_date(start_date, end_date)) {
    return "Data: " + start_date + " musi być wcześniejsza niż data: " + end_date;
  }
  return "";
}

export function convert_range_dates_and_validate(fileds: any, _start_date: string = "start_date",
                                                 _end_date: string = "end_date", _next_end_date: string | null = null) {
  let error = "";
  const start_date = fileds[_start_date];
  const end_date = fileds[_end_date];
  error += validate_date_range(start_date, end_date);
  if (_next_end_date){
    const next_end = fileds[_next_end_date];
    error += validate_date_range(end_date, next_end);
    if (next_end) fileds[_next_end_date] = convert_date_to_backend_format(next_end);
  }
  if (start_date) fileds[_start_date] = convert_date_to_backend_format(start_date);
  if (end_date) fileds[_end_date] = convert_date_to_backend_format(end_date);
  return error;
}

export function get_next_date(current_date:string): string {
  let date = new Date(current_date);
  date.setDate(date.getDate() + 1);
  return formatDate(date, 'yyyy.MM.dd', 'en');
}

export function is_working_day(current_date: string): boolean {
  const date = new Date(current_date);
  return !(date.getDay() === 6 || date.getDay() === 0);
}

export function get_day(current_date: string): number {
  const date = new Date(current_date);
  return date.getDay();
}


export function is_date_in_range (_date: string, _start_date: string, _end_date: string) {
  let date = new Date(convert_date_from_backend_format(_date, "-"));
  let start_date = new Date(convert_date_from_backend_format(_start_date, "-"));
  let end_date = new Date(convert_date_from_backend_format(_end_date, "-"));
  return start_date <= date && date <= end_date;

}
