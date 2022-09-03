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
