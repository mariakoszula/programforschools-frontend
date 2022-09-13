export function validate_date(start_date: string, end_date: string) {
  return new Date(start_date) < new Date(end_date);
}

export function convert_date_to_backend_format(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

export function convert_date_from_backend_format(date: string) {
  const [day, month, year] = date.split(".");
  return `${year}.${month}.${day}`;
}

export function convert_range_dates_and_validate(fileds: any, _start_date: string = "start_date",
                                                 _end_date: string = "end_date") {
  const start_date = fileds[_start_date];
  const end_date = fileds[_end_date];
  if (start_date && end_date && !validate_date(start_date, end_date)) {
    return "Data:: " + start_date + " musi być wcześniejsza niż data: " + end_date;
  }
  if (start_date) fileds[_start_date] = convert_date_to_backend_format(start_date);
  if (end_date) fileds[_end_date] = convert_date_to_backend_format(end_date);
  return "";
}
