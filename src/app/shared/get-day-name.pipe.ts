import {Pipe, PipeTransform} from "@angular/core";
import {convert_date_from_backend_format, get_day} from "./date_converter.utils";


@Pipe({name: 'dayName'})
export class DayName implements PipeTransform {
  transform(value: string): string {
    let day_no = get_day(convert_date_from_backend_format(value));
    let day = new Array(7);
    day[0] = "Nd";
    day[1] = "Pn";
    day[2] = "Wt";
    day[3] = "Śr";
    day[4] = "Czw";
    day[5] = "Pt";
    day[6] = "Sb";
    return day[day_no];
  }
}
